/**
 * Responsive Utils for Web (mimicking React Native libraries)
 * 
 * wp(percentage): Width percentage of viewport
 * hp(percentage): Height percentage of viewport
 * rf(size): Responsive font size based on standard mobile screen
 */

const getWidth = () => window.innerWidth;
const getHeight = () => window.innerHeight;

/**
 * Width Percentage
 * @param {string|number} percentage 
 * @returns {number} pixel value
 */
export const wp = (percentage) => {
    const value = typeof percentage === 'number' ? percentage : parseFloat(percentage);
    return (getWidth() * value) / 100;
};

/**
 * Height Percentage
 * @param {string|number} percentage 
 * @returns {number} pixel value
 */
export const hp = (percentage) => {
    const value = typeof percentage === 'number' ? percentage : parseFloat(percentage);
    return (getHeight() * value) / 100;
};

/**
 * Responsive Font Size
 * Mimics RFValue behavior (scaling based on standard screen width)
 * Standard screen width: 375px (iPhone X/11/12/13/Mini)
 * @param {number} size 
 * @returns {string} pixel value string
 */
export const rf = (size) => {
    const standardScreenHeight = 812;
    const heightPercent = (size * getHeight()) / standardScreenHeight;
    return `${Math.round(heightPercent)}px`;
};
