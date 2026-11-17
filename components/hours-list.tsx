'use client';

import type { ReactNode } from 'react';
import { restaurant } from '../content/restaurant';
import { formatService, groupedHours } from '../lib/hours';
import { useRestaurantClock } from './open-status';

const groups = groupedHours(restaurant.hours);

/**
 * Opening hours by service, grouped by day. After hydration the browser marks today's row (in the restaurant's
 * time zone); the static HTML makes no claim about today.
 */
export function HoursList({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const now = useRestaurantClock();
  return (
    <ul className={className}>
      {groups.map(group => {
        const today = !!now && group.days.includes(now.day);
        return (
          <li key={group.label} data-today={today}
            className={`hours-row grid gap-x-4 border-b border-dotted border-line ${compact ? 'grid-cols-[5.5rem_1fr] px-1 py-1.5 text-[.95rem]' : 'grid-cols-[minmax(5.5rem,auto)_1fr] px-2 py-2.5 sm:grid-cols-[7.5rem_1fr]'}`}>
            <span className="font-semibold">
              {group.label}
              {today ? <span className="block text-[.72rem] font-bold tracking-[.14em] text-gold-ink uppercase">Today</span> : null}
            </span>
            <span className="grid gap-0.5">
              {group.services.length ? group.services.map(service => (
                <span key={service.label} className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-muted">{service.label}</span><span className="whitespace-nowrap">{service.hours}</span>
                </span>
              )) : <span className="text-muted">Closed</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "Today, Wednesday: Dim sum 10:30am – 3pm · Dinner 5pm – 10pm". Before hydration (and without a time zone)
 * it shows `fallback` instead, so the static page never claims what today is.
 */
export function TodayHours({ fallback, className = '' }: { fallback: ReactNode; className?: string }) {
  const now = useRestaurantClock();
  if (!now) return <p className={className}>{fallback}</p>;
  const services = restaurant.hours.find(entry => entry.day === now.day)?.services ?? [];
  return (
    <p className={className}>
      <span className="font-semibold">Today, {now.day}:</span>{' '}
      {services.length ? services.map(service => `${service.label} ${formatService(service)}`).join(' · ') : 'closed'}
    </p>
  );
}
