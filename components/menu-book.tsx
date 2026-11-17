'use client';

import { useEffect, useRef, useState } from 'react';
import { dishByNumber, dishId, formatPrice, menu, sectionRange, type Dish } from '../content/menu';
import { restaurant, telHref } from '../content/restaurant';
import { MENU_FILTERS, matchesAll, type MenuFilter } from '../lib/menu-filter';
import {
  addDish, changeOption, estimatedTotal, itemCount, listAsText, optionLabels, removeLine, restoreList, setQuantity,
  STORAGE_KEY, unitPrice, type TakeawayList,
} from '../lib/takeaway';
import { AllergenKey, AllergenMarks, BadgeMark, DietMark, SpiceMarks } from './dish-marks';
import { Icon } from './icons';

function Price({ dish }: { dish: Dish }) {
  if (typeof dish.price === 'number') return <span className="dish-price text-[1.05rem] font-semibold">{formatPrice(dish.price)}</span>;
  return (
    <span className="dish-price grid justify-items-end text-[.95rem] leading-snug font-semibold">
      {dish.price.map(option => (
        <span key={option.label} className="whitespace-nowrap"><span className="text-[.8rem] font-normal text-muted">{option.label}</span> {formatPrice(option.amount)}</span>
      ))}
    </span>
  );
}

function DishRow({ dish, visible, count, onAdd }: { dish: Dish; visible: boolean; count: number; onAdd: (dish: Dish) => void }) {
  const soldOut = !!dish.soldOut;
  return (
    <li id={dishId(dish.number)} hidden={!visible} data-sold-out={soldOut}
      className="dish-row press-in grid break-inside-avoid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 border-b border-dotted border-line px-1 py-3.5 sm:gap-x-4">
      <span className="seal mt-1">{dish.number}</span>
      <div className="min-w-0">
        {dish.nameZh ? <p lang="zh-Hant" className="dish-name text-[.9rem] leading-tight tracking-[.12em] text-gold-ink">{dish.nameZh}</p> : null}
        <h3 className="dish-name font-display text-[1.18rem] leading-snug font-semibold">{dish.name}</h3>
        <p className="mt-0.5 text-[.93rem] leading-snug text-muted">{dish.description}</p>
        {soldOut || dish.badge || dish.diet || dish.spice || dish.allergens.length ? (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {soldOut ? <span className="mark mark-soldout">Sold out today</span> : null}
            {dish.badge ? <BadgeMark badge={dish.badge} /> : null}
            {dish.diet ? <DietMark diet={dish.diet} /> : null}
            <SpiceMarks level={dish.spice} />
            <AllergenMarks allergens={dish.allergens} />
          </p>
        ) : null}
      </div>
      <div className="grid content-start justify-items-end gap-2 pt-1 text-right">
        <Price dish={dish} />
        {soldOut ? null : (
          <button type="button" className="add-button chip min-h-8 px-2.5 py-0.5 text-[.85rem] print:hidden" data-count={count}
            onClick={() => onAdd(dish)}
            aria-label={`Add ${dish.number}, ${dish.name}, to your takeaway list${count ? ` (${count} on it)` : ''}`}>
            {count ? <><Icon name="check" width={14} height={14} />{count}</> : <><Icon name="plus" width={14} height={14} />Add</>}
          </button>
        )}
      </div>
    </li>
  );
}

function readSaved(): unknown {
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function save(list: TakeawayList) {
  try {
    if (list.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private windows, blocked site data). The list still works for this visit.
  }
}

/**
 * The full numbered menu with filters and the takeaway list.
 *
 * Every dish is in the static HTML, so callers can order by number without JavaScript. With JavaScript, the
 * filters hide non-matching rows and each available dish gets an "Add" button that builds a phone-order list.
 * The list is kept only in this browser (localStorage) and is never sent anywhere: it's a note to read out on
 * the phone, not online ordering.
 */
export function MenuBook() {
  const [ready, setReady] = useState(false);
  const [filters, setFilters] = useState<MenuFilter[]>([]);
  const [list, setList] = useState<TakeawayList>([]);
  const [dropped, setDropped] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Restore a saved list once, against today's menu (sold-out or removed dishes are dropped).
  useEffect(() => {
    const restored = restoreList(readSaved(), dishByNumber);
    setList(restored.list);
    setDropped(restored.dropped);
    setReady(true);
    return () => clearTimeout(copyTimer.current);
  }, []);

  useEffect(() => { if (ready) save(list); }, [list, ready]);

  // Functional updates, so several quick taps never work from a stale list.
  const update = (change: (current: TakeawayList) => TakeawayList) => { setList(change); setDropped([]); };
  const countFor = (number: number) => list.filter(line => line.number === number).reduce((sum, line) => sum + line.quantity, 0);
  const toggle = (id: MenuFilter) => setFilters(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const visible = (dish: Dish) => matchesAll(dish, filters);
  const counts = Object.fromEntries(menu.sections.map(section => [section.id, section.dishes.filter(visible).length]));
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const items = itemCount(list);
  const { phone } = restaurant.takeaway;

  async function copyList() {
    try {
      await navigator.clipboard.writeText(listAsText(list, dishByNumber, formatPrice, `${restaurant.name} takeaway list`));
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopy('idle'), 4000);
  }

  return (
    <div className="menu-book wrap grid items-start gap-x-[clamp(1.5rem,3vw,2.75rem)] lg:grid-cols-[minmax(0,1fr)_19rem]" data-ready={ready || undefined}>
      <div className="min-w-0">
        <div className="no-print sticky top-(--bar-h) z-20 -mx-1 mb-2 border-b border-line bg-bg/95 px-1 py-2.5 backdrop-blur-sm">
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto p-0.5" role="group" aria-label="Menu filters">
            <span className="inline-flex items-center gap-1.5 pr-1 text-[.85rem] font-semibold whitespace-nowrap text-muted"><Icon name="filter" width={16} height={16} />Show only</span>
            {MENU_FILTERS.map(filter => (
              <button key={filter.id} type="button" className="chip min-h-9 py-0.5 text-[.88rem]" aria-pressed={filters.includes(filter.id)} onClick={() => toggle(filter.id)}>
                {filter.label}
              </button>
            ))}
            {filters.length ? <button type="button" className="chip min-h-9 border-dashed py-0.5 text-[.88rem] text-muted" onClick={() => setFilters([])}>Clear</button> : null}
          </div>
          <p className="sr-only" role="status" aria-live="polite">{filters.length ? `${total} dishes match.` : ''}</p>
        </div>

        {menu.sections.map(section => (
          <section key={section.id} id={section.id} className="pt-9 pb-2" aria-labelledby={`${section.id}-title`}>
            <header className="watermark mb-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b border-gold/70 pb-3" data-zh={section.titleZh}>
              <div>
                <h2 id={`${section.id}-title`} className="text-[clamp(1.9rem,3.6vw,2.6rem)]">
                  {section.title} <span className="font-sans text-[.5em] font-semibold tracking-[.06em] text-gold-ink">· {sectionRange(section)}</span>
                </h2>
                <p className="mt-1 max-w-(--measure) text-[.97rem] text-muted">{section.description}</p>
              </div>
              <span lang="zh-Hant" className="text-[1.05rem] tracking-[.3em] text-gold-ink max-sm:hidden">{section.titleZh}</span>
            </header>
            {counts[section.id] ? (
              <ul className="gap-x-9 2xl:columns-2">
                {section.dishes.map(dish => (
                  <DishRow key={dish.number} dish={dish} visible={visible(dish)} count={countFor(dish.number)} onAdd={d => update(current => addDish(current, d))} />
                ))}
              </ul>
            ) : (
              <p className="border border-dashed border-line p-4 text-muted">Nothing in this section matches those filters. Ask when you call: we can often leave something out or make it milder.</p>
            )}
          </section>
        ))}

        <div className="mt-8 border-t border-gold/70 pt-5">
          <AllergenKey note={menu.allergenNote} />
          <ul className="mt-4 grid max-w-(--measure) gap-1.5 text-[.9rem] text-muted">
            {menu.notes.map(note => <li key={note}>{note}</li>)}
          </ul>
        </div>
      </div>

      {/* The takeaway list: docked on the right on desktop, a bottom sheet with a count on phones. */}
      <aside aria-labelledby="takeaway-title" data-open={open}
        className={`takeaway-panel menu-card mt-8 lg:sticky lg:top-6 lg:mt-12 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto ${ready ? 'max-lg:fixed max-lg:inset-x-2 max-lg:bottom-2 max-lg:z-40 max-lg:mt-0 max-lg:max-h-[80dvh] max-lg:overflow-y-auto max-lg:shadow-lift' : ''}`}>
        <div className="flex items-center justify-between gap-3 border-b border-gold/50 px-4 py-3">
          <h2 id="takeaway-title" className="flex items-baseline gap-2 text-[1.3rem]">
            Takeaway list <span lang="zh-Hant" className="text-[.8rem] tracking-[.2em] text-gold-ink">外賣單</span>
          </h2>
          {ready ? (
            <button type="button" className="chip min-h-9 shrink-0 py-0.5 text-[.88rem] lg:pointer-events-none lg:border-transparent lg:bg-transparent lg:px-0"
              aria-expanded={open} aria-controls="takeaway-body" onClick={() => setOpen(value => !value)}>
              <span className="seal seal-sm">{items}</span>
              <span className="lg:sr-only">{items ? formatPrice(estimatedTotal(list, dishByNumber)) : 'Empty'}</span>
              <span className="sr-only">{items === 1 ? 'dish' : 'dishes'} on your list. {open ? 'Hide' : 'Show'} the list</span>
              <Icon name={open ? 'close' : 'list'} width={16} height={16} className="lg:hidden" />
            </button>
          ) : null}
        </div>

        <div id="takeaway-body" className={`grid gap-4 px-4 pt-3 pb-4 ${ready && !open ? 'max-lg:hidden' : ''}`}>
          {!ready ? (
            <p className="text-[.95rem] text-muted">
              Order by number: call <a className="text-link" href={telHref(phone)}>{phone}</a> and read out the numbers of the dishes you’d like.
            </p>
          ) : (
            <>
              {dropped.length ? (
                <p className="border-l-2 border-accent pl-3 text-[.88rem]">
                  Removed from your saved list: {dropped.join(', ')} (sold out today or no longer on the menu).
                </p>
              ) : null}
              {list.length ? (
                <ul className="grid gap-0">
                  {list.map(line => {
                    const dish = dishByNumber(line.number);
                    if (!dish) return null;
                    const labels = optionLabels(dish);
                    const price = (unitPrice(line, dish) ?? 0) * line.quantity;
                    const key = `${line.number}-${line.option ?? ''}`;
                    return (
                      <li key={key} className="takeaway-line grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2.5 border-b border-dotted border-line py-2.5">
                        <span className="seal seal-sm mt-0.5">{line.number}</span>
                        <div className="min-w-0">
                          <p className="text-[.95rem] leading-snug font-semibold">{dish.name}</p>
                          {labels.length ? (
                            <label className="mt-1 inline-flex items-center gap-1.5 text-[.82rem] text-muted">
                              <span className="sr-only">Size for {dish.name}</span>
                              <select className="rounded-ui border border-line bg-surface px-1.5 py-0.5 text-[.85rem] text-ink" value={line.option}
                                onChange={event => update(current => changeOption(current, dish, line.option, event.target.value))}>
                                {labels.map(label => <option key={label} value={label}>{label}</option>)}
                              </select>
                            </label>
                          ) : null}
                          <div className="mt-1.5 flex items-center gap-1 no-print" role="group" aria-label={`Quantity of ${dish.name}`}>
                            <button type="button" className="grid size-7 place-items-center rounded-ui border border-line hover:border-gold"
                              aria-label={`One less ${dish.name}`} onClick={() => update(current => setQuantity(current, line.number, line.option, line.quantity - 1))}>
                              <Icon name="minus" width={14} height={14} />
                            </button>
                            <span className="min-w-7 text-center font-semibold" aria-live="polite">× {line.quantity}</span>
                            <button type="button" className="grid size-7 place-items-center rounded-ui border border-line hover:border-gold"
                              aria-label={`One more ${dish.name}`} onClick={() => update(current => setQuantity(current, line.number, line.option, line.quantity + 1))}>
                              <Icon name="plus" width={14} height={14} />
                            </button>
                          </div>
                        </div>
                        <div className="grid justify-items-end gap-1">
                          <span className="font-semibold">{formatPrice(price)}</span>
                          <button type="button" className="text-[.8rem] text-muted underline underline-offset-2 hover:text-accent-ink no-print"
                            onClick={() => update(current => removeLine(current, line.number, line.option))} aria-label={`Remove ${dish.name}`}>
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-[.95rem] text-muted">
                  Nothing here yet. Tap <strong className="font-semibold text-ink">Add</strong> beside a dish and its number goes on your list, ready to read out when you call.
                </p>
              )}
              <p className="flex items-baseline justify-between gap-3 border-t border-gold/50 pt-3">
                <span className="text-[.95rem] font-semibold">Estimated total</span>
                <span className="font-display text-[1.45rem] font-semibold">{formatPrice(estimatedTotal(list, dishByNumber))}</span>
              </p>
              <div className="grid gap-2 no-print">
                <a className="button w-full" href={telHref(phone)}><Icon name="phone" width={18} height={18} />Call {phone}</a>
                <div className="flex gap-2">
                  <button type="button" className="button button-quiet flex-1" onClick={copyList} disabled={!list.length}>
                    <Icon name="copy" width={16} height={16} />Copy list
                  </button>
                  <button type="button" className="button button-quiet" onClick={() => update(() => [])} disabled={!list.length}>Clear</button>
                </div>
                <p className="copy-status text-[.85rem] text-muted" role="status" aria-live="polite">
                  {copy === 'copied' ? 'Copied. Paste it into a note or read it out when you call.' : copy === 'failed' ? 'Couldn’t copy here. The list above has everything.' : ''}
                </p>
              </div>
            </>
          )}
          <p className="text-[.82rem] leading-snug text-muted">
            This list stays on your device and isn’t sent to us. Call to place your order; prices are confirmed by phone.
          </p>
        </div>
      </aside>
      {ready ? <div className="h-20 lg:hidden" aria-hidden="true" /> : null}
    </div>
  );
}
