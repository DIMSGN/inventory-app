import {
  formatCurrency,
  formatPercentage,
  formatDate,
  formatNumber
} from '../formatters';

describe('Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('formats numbers correctly with default EUR currency', () => {
      expect(formatCurrency(1000)).toBe('1.000,00 €');
      expect(formatCurrency(1000.5)).toBe('1.000,50 €');
      expect(formatCurrency(0)).toBe('0,00 €');
      expect(formatCurrency(-1500)).toBe('-1.500,00 €');
    });

    it('returns dash for null or undefined values', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
    });

    it('formats with different currencies', () => {
      expect(formatCurrency(1000, 'USD', 'en-US')).toBe('$1,000.00');
      expect(formatCurrency(1000, 'GBP', 'en-GB')).toBe('£1,000.00');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage values correctly', () => {
      expect(formatPercentage(25)).toMatch(/25[.,]0%/);
      expect(formatPercentage(10.5)).toMatch(/10[.,]5%/);
      expect(formatPercentage(0)).toMatch(/0[.,]0%/);
    });

    it('returns dash for null or undefined values', () => {
      expect(formatPercentage(null)).toBe('-');
      expect(formatPercentage(undefined)).toBe('-');
    });
  });

  describe('formatDate', () => {
    it('formats dates correctly with default format', () => {
      const testDate = new Date(2023, 0, 15); // Jan 15, 2023
      expect(formatDate(testDate)).toBe('15/01/2023');
    });

    it('handles string dates', () => {
      expect(formatDate('2023-01-15')).toBe('15/01/2023');
    });

    it('returns empty string for null or empty values', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('formats with long format', () => {
      const testDate = new Date(2023, 0, 15);
      // This might vary by environment, but should include month name
      expect(formatDate(testDate, 'long')).toContain('2023');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1.000');
      expect(formatNumber(1000000)).toBe('1.000.000');
      expect(formatNumber(1234.56, 'en-US')).toBe('1,234.56');
    });

    it('returns dash for null or undefined values', () => {
      expect(formatNumber(null)).toBe('-');
      expect(formatNumber(undefined)).toBe('-');
    });
  });
}); 