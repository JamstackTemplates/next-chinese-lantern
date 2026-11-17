import { restaurant, telHref } from '../content/restaurant';
import { Icon } from './icons';

/**
 * The primary action: a "Call for takeaway" tel: button with the number written large beside it, for
 * desktop visitors who can't tap it.
 */
export function CallForTakeaway({ className = '', label = 'Call for takeaway' }: { className?: string; label?: string }) {
  const { phone } = restaurant.takeaway;
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      <a className="button" href={telHref(phone)}><Icon name="phone" width={18} height={18} />{label}</a>
      <a href={telHref(phone)} className="font-display text-[1.45rem] font-semibold whitespace-nowrap no-underline hover:text-accent-ink" aria-label={`Phone ${phone}`}>
        {phone}
      </a>
    </span>
  );
}
