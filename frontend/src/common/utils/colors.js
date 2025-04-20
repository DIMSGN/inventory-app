/**
 * Utility functions for color management and manipulation
 */

/**
 * Default color palette
 */
export const DEFAULT_COLORS = [
  '#1890ff', // Primary Blue
  '#52c41a', // Success Green
  '#faad14', // Warning Yellow
  '#f5222d', // Error Red
  '#722ed1', // Purple
  '#eb2f96', // Pink
  '#fa8c16', // Orange
  '#a0d911', // Lime
  '#13c2c2', // Cyan
  '#2f54eb', // Geekblue
];

/**
 * Converts a hex color to RGB components
 * @param {string} hex - Hex color string (e.g., "#ff0000")
 * @returns {Object} RGB components as {r, g, b}
 */
export const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

/**
 * Converts RGB components to a hex color string
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {string} Hex color string
 */
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Adjusts the brightness of a color
 * @param {string} color - Hex color string
 * @param {number} factor - Factor to adjust by (0-1)
 * @returns {string} Adjusted hex color
 */
export const adjustBrightness = (color, factor) => {
  const { r, g, b } = hexToRgb(color);
  
  // Adjust each component
  const adjustedR = Math.round(r * factor);
  const adjustedG = Math.round(g * factor);
  const adjustedB = Math.round(b * factor);
  
  // Ensure values are within 0-255 range
  const clampedR = Math.min(255, Math.max(0, adjustedR));
  const clampedG = Math.min(255, Math.max(0, adjustedG));
  const clampedB = Math.min(255, Math.max(0, adjustedB));
  
  return rgbToHex(clampedR, clampedG, clampedB);
};

/**
 * Calculates if a color is light or dark
 * @param {string} color - Hex color string
 * @returns {boolean} True if the color is light
 */
export const isLightColor = (color) => {
  const { r, g, b } = hexToRgb(color);
  
  // Calculate the perceptive luminance
  // See: https://www.w3.org/TR/WCAG20-TECHS/G17.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
};

/**
 * Gets a text color (black or white) that will be readable on a given background color
 * @param {string} backgroundColor - Hex color string
 * @returns {string} Text color as hex
 */
export const getTextColorForBackground = (backgroundColor) => {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
};

export default {
  DEFAULT_COLORS,
  hexToRgb,
  rgbToHex,
  adjustBrightness,
  isLightColor,
  getTextColorForBackground
};
