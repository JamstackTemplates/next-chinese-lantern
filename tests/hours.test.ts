// The "open now / takeaway calls" status: pure logic, so every case runs without a browser or a clock.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { describeOpenState, groupedHours, openState, toMinutes, zonedNow, type DayHours } from '../lib/hours.ts';

const dimSum = { label: 'Dim sum', opens: '10:30', closes: '15:00' } as const;
const dinner = { label: 'Dinner', opens: '17:00', closes: '22:00' } as const;
const week: DayHours[] = [
  { day: 'Monday', services: [dimSum, dinner] },
  { day: 'Tuesday', services: [] },
  { day: 'Wednesday', services: [dimSum, dinner] },
  { day: 'Thursday', services: [dimSum, dinner] },
  { day: 'Friday', services: [dimSum, { label: 'Dinner', opens: '17:00', closes: '23:00' }] },
  { day: 'Saturday', services: [{ label: 'Dim sum', opens: '10:00', closes: '15:00' }, { label: 'Dinner', opens: '17:00', closes: '23:00' }] },
  { day: 'Sunday', services: [{ label: 'All day', opens: '11:00', closes: '21:00' }] },
];
const status = (day: DayHours['day'], time: string, hours = week) => describeOpenState(openState(day, toMinutes(time), hours, 30));

test('before opening', () => {
  assert.deepEqual(status('Wednesday', '08:00'), { text: 'Closed · opens today at 10:30am', tone: 'closed' });
  assert.deepEqual(status('Wednesday', '10:29'), { text: 'Closed · opens today at 10:30am', tone: 'closed' });
});

test('during dim sum, with dinner still to come', () => {
  assert.deepEqual(status('Wednesday', '10:30'), { text: 'Dim sum until 3pm · dinner from 5pm', tone: 'open' });
  assert.deepEqual(status('Thursday', '13:00'), { text: 'Dim sum until 3pm · dinner from 5pm', tone: 'open' });
  const state = openState('Thursday', toMinutes('13:00'), week, 30);
  assert.equal(state.status, 'open');
  assert.equal(state.status === 'open' && state.minutesLeft, 90);
});

test('during the last service of the day: takeaway calls until last orders', () => {
  assert.deepEqual(status('Wednesday', '19:30'), { text: 'Open · taking takeaway calls until 9:30pm', tone: 'open' });
  assert.deepEqual(status('Friday', '17:00'), { text: 'Open · taking takeaway calls until 10:30pm', tone: 'open' });
  assert.deepEqual(status('Sunday', '12:00'), { text: 'Open · taking takeaway calls until 8:30pm', tone: 'open' });
});

test('the last-orders window', () => {
  assert.deepEqual(status('Wednesday', '21:15'), { text: 'Last orders in 15 minutes', tone: 'soon' });
  assert.deepEqual(status('Wednesday', '21:29'), { text: 'Last orders in 1 minute', tone: 'soon' });
  assert.deepEqual(status('Wednesday', '21:14'), { text: 'Open · taking takeaway calls until 9:30pm', tone: 'open' });
  // Dim sum's own last orders count too.
  assert.deepEqual(status('Monday', '14:20'), { text: 'Last orders in 10 minutes', tone: 'soon' });
});

test('the gap between services', () => {
  assert.deepEqual(status('Thursday', '14:30'), { text: 'Last orders taken · dinner from 5pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '15:00'), { text: 'Between services · dinner from 5pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '16:59'), { text: 'Between services · dinner from 5pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '17:00'), { text: 'Open · taking takeaway calls until 9:30pm', tone: 'open' });
});

test('after last orders and after closing', () => {
  assert.deepEqual(status('Thursday', '21:45'), { text: 'Last orders taken · opens tomorrow at 10:30am', tone: 'closed' });
  assert.deepEqual(status('Thursday', '22:00'), { text: 'Closed · opens tomorrow at 10:30am', tone: 'closed' });
  assert.deepEqual(status('Friday', '23:30'), { text: 'Closed · opens tomorrow at 10am', tone: 'closed' });
});

test('the closed Tuesday', () => {
  assert.deepEqual(status('Tuesday', '09:00'), { text: 'Closed today · opens tomorrow at 10:30am', tone: 'closed' });
  assert.deepEqual(status('Tuesday', '19:00'), { text: 'Closed today · opens tomorrow at 10:30am', tone: 'closed' });
});

test('the next opening across a closed day', () => {
  // Monday night → Tuesday is closed → Wednesday dim sum.
  assert.deepEqual(status('Monday', '22:30'), { text: 'Closed · opens Wednesday at 10:30am', tone: 'closed' });
  assert.deepEqual(status('Monday', '21:40'), { text: 'Last orders taken · opens Wednesday at 10:30am', tone: 'closed' });
  // Several closed days in a row, wrapping round the end of the week.
  const short: DayHours[] = week.map(entry => ({ ...entry, services: entry.day === 'Thursday' ? [dinner] : [] }));
  assert.deepEqual(status('Thursday', '23:00', short), { text: 'Closed · opens Thursday at 5pm', tone: 'closed' });
  assert.deepEqual(status('Saturday', '13:00', short), { text: 'Closed today · opens Thursday at 5pm', tone: 'closed' });
  assert.deepEqual(status('Wednesday', '13:00', short), { text: 'Closed today · opens tomorrow at 5pm', tone: 'closed' });
  // No services at all never claims an opening.
  assert.deepEqual(status('Monday', '13:00', week.map(entry => ({ ...entry, services: [] }))), { text: 'Closed today', tone: 'closed' });
});

test('hours group consecutive days and keep each day for the "today" mark', () => {
  const groups = groupedHours(week);
  assert.deepEqual(groups.map(group => group.label), ['Monday', 'Tuesday', 'Wed – Thu', 'Friday', 'Saturday', 'Sunday']);
  assert.deepEqual(groups[2].days, ['Wednesday', 'Thursday']);
  assert.deepEqual(groups[1].services, []);
  assert.deepEqual(groups[0].services, [{ label: 'Dim sum', hours: '10:30am – 3pm' }, { label: 'Dinner', hours: '5pm – 10pm' }]);
});

test('the browser clock is read in the restaurant’s time zone', () => {
  // 2026-01-14 is a Wednesday. 01:30 UTC is 8:30pm on Tuesday in Philadelphia (UTC−5).
  assert.deepEqual(zonedNow('America/New_York', new Date('2026-01-14T01:30:00Z')), { day: 'Tuesday', minutes: 20 * 60 + 30 });
  // Daylight saving: 2026-07-15 16:05 UTC is 12:05pm in Philadelphia (UTC−4).
  assert.deepEqual(zonedNow('America/New_York', new Date('2026-07-15T16:05:00Z')), { day: 'Wednesday', minutes: 12 * 60 + 5 });
});
