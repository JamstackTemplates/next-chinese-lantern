'use client';

import { useEffect, useState } from 'react';
import { restaurant } from '../content/restaurant';
import { describeOpenState, openState, zonedNow, type Day, type OpenTone } from '../lib/hours';

// Inlined at build time from site.config.json `timeZone` (see next.config.mjs). Client components read this
// one value instead of importing lib/site.ts, which would ship the Jamstacks embed URL to every page.
const timeZone = process.env.NEXT_PUBLIC_SITE_TIME_ZONE ?? '';

/** The restaurant's current weekday and minutes after midnight, refreshed every minute; null before hydration. */
export function useRestaurantClock(): { day: Day; minutes: number } | null {
  const [now, setNow] = useState<{ day: Day; minutes: number } | null>(null);
  useEffect(() => {
    if (!timeZone) return;
    const update = () => setNow(zonedNow(timeZone));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

/**
 * "Open · taking takeaway calls until 9:30pm". The static HTML shows a neutral "Call for takeaway" (plus the
 * number when `withPhone`), and the browser fills in the live state after hydration, so the build never bakes in
 * the time it ran. Without a configured time zone the neutral label stays.
 */
export function OpenStatus({ className = '', withPhone = false }: { className?: string; withPhone?: boolean }) {
  const now = useRestaurantClock();
  const label: { text: string; tone: OpenTone } | null = now
    ? describeOpenState(openState(now.day, now.minutes, restaurant.hours, restaurant.takeaway.lastOrdersMinutes))
    : null;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} data-tone={label?.tone}>
      <span className="status-dot" aria-hidden="true" />
      <span role="status">
        {label?.text ?? 'Call for takeaway'}
        {!label && withPhone ? <span className="whitespace-nowrap"> · {restaurant.takeaway.phone}</span> : null}
      </span>
    </span>
  );
}
