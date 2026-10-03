import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatDateTime } from './i18n.ts';

test('formatDateTime: date and time when time was recorded', () => {
  assert.equal(formatDateTime(new Date('2025-01-03T00:48:00-03:00')), '03/01/2025 00:48');
  assert.equal(formatDateTime(new Date('2025-01-03T14:05:00-03:00')), '03/01/2025 14:05');
});

test('formatDateTime: midnight in São Paulo means no time recorded, date only', () => {
  const midnight = new Date('2024-01-10T00:00:00-03:00');
  assert.equal(formatDateTime(midnight), '10/01/2024');
  assert.equal(formatDateTime(midnight, 'en'), formatDate(midnight, 'en'));
});

test('formatDateTime: midnight UTC is not midnight in São Paulo, keeps the time', () => {
  assert.equal(formatDateTime(new Date('2024-01-10T00:00:00Z')), '09/01/2024 21:00');
});
