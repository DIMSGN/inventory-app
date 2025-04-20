/**
 * Utility for converting between different measurement units
 * 
 * Supports following conversions:
 * - Volume: ml, cl, l
 * - Weight: g, kg
 * - Count: pcs (no conversion)
 */

/**
 * Converts a value from one unit to another
 * 
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit (ml, cl, l, g, kg, pcs)
 * @param {string} toUnit - Target unit (ml, cl, l, g, kg, pcs)
 * @returns {number} Converted value
 */
export const convertUnits = (value, fromUnit, toUnit) => {
  // If units are the same, no conversion needed
  if (fromUnit === toUnit) {
    return value;
  }

  // For pieces, no conversion possible to other units
  if (fromUnit === 'pcs' || toUnit === 'pcs') {
    return value; // Can't convert pieces to other units
  }

  // Volume conversions
  const volumeUnits = {
    ml: 1,
    cl: 10,
    l: 1000
  };

  // Weight conversions
  const weightUnits = {
    g: 1,
    kg: 1000
  };

  // Check if both units are in the same category
  const isVolumeConversion = fromUnit in volumeUnits && toUnit in volumeUnits;
  const isWeightConversion = fromUnit in weightUnits && toUnit in weightUnits;

  if (isVolumeConversion) {
    // Convert to base unit (ml) first, then to target unit
    const valueInMl = value * volumeUnits[fromUnit];
    return valueInMl / volumeUnits[toUnit];
  }

  if (isWeightConversion) {
    // Convert to base unit (g) first, then to target unit
    const valueInGrams = value * weightUnits[fromUnit];
    return valueInGrams / weightUnits[toUnit];
  }

  // If units are not compatible, return original value
  return value;
}; 