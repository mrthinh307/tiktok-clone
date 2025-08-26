/**
 * Format number to display in short form (K, M, B)
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (!num || isNaN(num)) return '0';
  
  const number = parseInt(num);
  
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else if (number < 1000000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
};

/**
 * Format views count for display
 * @param {number} views - Number of views
 * @returns {string} - Formatted views string
 */
export const formatViews = (views) => {
  return formatNumber(views);
};
