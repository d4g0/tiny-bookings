export { isValidString } from "./isValidString";

export function mapLineToArray(line = '', splitter = '') {
    var lines = line.split(splitter)
    return lines;
}
