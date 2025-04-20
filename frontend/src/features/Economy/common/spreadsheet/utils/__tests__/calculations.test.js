import {
  sumValues,
  calculatePercentage,
  calculateAverage,
  calculateRowTotals,
  calculateColumnTotals
} from '../calculations';

describe('Calculation Utilities', () => {
  describe('sumValues', () => {
    it('sums an array of numbers correctly', () => {
      expect(sumValues([1, 2, 3, 4, 5])).toBe(15);
      expect(sumValues([10, -5, 3])).toBe(8);
    });

    it('handles null and undefined values', () => {
      expect(sumValues([1, null, 3, undefined, 5])).toBe(9);
    });

    it('returns 0 for empty arrays', () => {
      expect(sumValues([])).toBe(0);
    });

    it('returns 0 for non-array inputs', () => {
      expect(sumValues(null)).toBe(0);
      expect(sumValues(undefined)).toBe(0);
      expect(sumValues('not an array')).toBe(0);
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(50, 200)).toBe(25);
      expect(calculatePercentage(150, 50)).toBe(300); // Can exceed 100%
    });

    it('handles edge cases', () => {
      expect(calculatePercentage(0, 100)).toBe(0);
      expect(calculatePercentage(100, 0)).toBe(0); // Division by zero
      expect(calculatePercentage(0, 0)).toBe(0);
      expect(calculatePercentage(null, 100)).toBe(0);
      expect(calculatePercentage(100, null)).toBe(0);
    });
  });

  describe('calculateAverage', () => {
    it('calculates average correctly', () => {
      expect(calculateAverage([10, 20, 30])).toBe(20);
      expect(calculateAverage([5, 5, 5, 5])).toBe(5);
    });

    it('handles null and undefined values', () => {
      expect(calculateAverage([10, null, 20, undefined])).toBe(30 / 4);
    });

    it('returns 0 for empty arrays', () => {
      expect(calculateAverage([])).toBe(0);
    });

    it('returns 0 for non-array inputs', () => {
      expect(calculateAverage(null)).toBe(0);
      expect(calculateAverage(undefined)).toBe(0);
    });
  });

  describe('calculateRowTotals', () => {
    it('calculates totals for each row', () => {
      const testData = [
        { id: 1, name: 'Item 1', months: [10, 20, 30] },
        { id: 2, name: 'Item 2', months: [5, 15, 25] }
      ];
      
      const result = calculateRowTotals(testData);
      
      expect(result[0].total).toBe(60);
      expect(result[1].total).toBe(45);
    });

    it('handles rows with null/undefined values', () => {
      const testData = [
        { id: 1, name: 'Item 1', months: [10, null, 30, undefined] }
      ];
      
      const result = calculateRowTotals(testData);
      
      expect(result[0].total).toBe(40);
    });

    it('handles rows without months array', () => {
      const testData = [
        { id: 1, name: 'Item 1' }, // No months array
        { id: 2, name: 'Item 2', months: null }
      ];
      
      const result = calculateRowTotals(testData);
      
      expect(result[0].total).toBe(0);
      expect(result[1].total).toBe(0);
    });

    it('returns empty array for non-array inputs', () => {
      expect(calculateRowTotals(null)).toEqual([]);
      expect(calculateRowTotals(undefined)).toEqual([]);
    });
  });

  describe('calculateColumnTotals', () => {
    it('calculates totals for each column', () => {
      const testData = [
        { id: 1, name: 'Item 1', months: [10, 20, 30] },
        { id: 2, name: 'Item 2', months: [5, 15, 25] }
      ];
      
      const result = calculateColumnTotals(testData, 3);
      
      expect(result).toEqual([15, 35, 55]);
    });

    it('handles columns with null/undefined values', () => {
      const testData = [
        { id: 1, name: 'Item 1', months: [10, null, 30] },
        { id: 2, name: 'Item 2', months: [5, 15, null] }
      ];
      
      const result = calculateColumnTotals(testData, 3);
      
      expect(result).toEqual([15, 15, 30]);
    });

    it('handles mismatched array lengths', () => {
      const testData = [
        { id: 1, name: 'Item 1', months: [10, 20] },
        { id: 2, name: 'Item 2', months: [5, 15, 25, 35] }
      ];
      
      const result = calculateColumnTotals(testData, 4);
      
      expect(result).toEqual([15, 35, 25, 35]);
    });

    it('returns array of zeros for empty or invalid input', () => {
      expect(calculateColumnTotals([], 3)).toEqual([0, 0, 0]);
      expect(calculateColumnTotals(null, 2)).toEqual([0, 0]);
    });
  });
}); 