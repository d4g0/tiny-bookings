/**
 * Returns `true` if the provided `str` arg 
 * is type String and is not the empty string
 * false other wise
 * @param {String} str 
 * @returns 
 */
export function isValidString(str){
    if(! (typeof str == 'string')){
        return false
    }
    return str.trim().length
}