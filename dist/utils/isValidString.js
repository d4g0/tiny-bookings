"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidString = isValidString;

/**
 * Returns `true` if the provided `str` arg 
 * is type String and is not the empty string
 * false other wise
 * @param {String} str 
 * @returns 
 */
function isValidString(str) {
  if (!(typeof str == 'string')) {
    return false;
  }

  return str.trim().length;
}