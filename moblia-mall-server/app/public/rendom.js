/**
 * 返回最大与最小值之间的任意随机数
 * @param {number} max 最大值
 * @param {number} min 最小值
 * @returns number
 */
const getRandom = (max, min) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = getRandom;
