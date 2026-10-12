import { describe, expect, it } from 'vitest';
import { formatCompactUsd, formatPercent, formatPrice } from './format';

describe('format helpers', () => {
  it('formats prices with more precision under $1', () => {
    expect(formatPrice(66400)).toBe('$66,400.00');
    expect(formatPrice(0.142345)).toBe('$0.142345');
    expect(formatPrice(null)).toBe('N/A');
  });

  it('formats large USD values compactly', () => {
    expect(formatCompactUsd(1_280_000_000_000)).toBe('$1.28T');
    expect(formatCompactUsd(950_000_000)).toBe('$950M');
    expect(formatCompactUsd(undefined)).toBe('N/A');
  });

  it('formats percentages with an optional sign', () => {
    expect(formatPercent(3.456)).toBe('3.46%');
    expect(formatPercent(3.456, { signed: true })).toBe('+3.46%');
    expect(formatPercent(-1.2, { signed: true })).toBe('-1.20%');
    expect(formatPercent(null)).toBe('N/A');
  });
});
