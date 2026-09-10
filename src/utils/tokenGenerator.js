/**
 * Generates the next sequential alphanumeric digital token (e.g. A121, A122)
 * based on all existing tokens in state (bookings and queue).
 *
 * @param {Object} state - The global AppContext state containing bookings and queue
 * @param {string} prefix - The token letter prefix (default 'A')
 * @returns {string} The next available unique token string
 */
export const generateNextToken = (state, prefix = 'A') => {
  const existingTokens = [
    ...(state?.bookings || []).map(b => b?.token),
    ...(state?.queue || []).map(q => q?.token)
  ].filter(Boolean);

  let maxNum = 104; // Baseline start for demo seed

  existingTokens.forEach(tok => {
    const match = String(tok).match(/^[A-Za-z]?(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  return `${prefix}${maxNum + 1}`;
};

/**
 * Generates a unique Farmer Identity ID (e.g. KIS-7F29A81C).
 *
 * @returns {string} Unique Farmer identifier
 */
export const generateFarmerId = () => {
  const hexPart = Math.random().toString(16).substring(2, 10).toUpperCase();
  return `KIS-${hexPart.padEnd(8, '0')}`;
};
