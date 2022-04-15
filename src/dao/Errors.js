
/**
 * Unique constraint.
 * Prisma Sample Exeption:
 * ```js
 * code: 'P2002',
 * clientVersion: '3.11.0',
 * meta: { target: [ 'room_name' ] }
 * ```
 */
// key
export const DB_UNIQUE_CONSTRAINT_ERROR_KEY = 'DB_UNIQUE_CONSTRAINT_ERROR';
// class
export class DB_UNIQUE_CONSTRAINT_ERROR extends Error {
    constructor(message, target = '') {
        super(message, target);
        this.code = DB_UNIQUE_CONSTRAINT_ERROR_KEY;
        this.target = target;
    }
}


/**
 * Delete record not found
 */
// P2025
// key
export const NOT_FOUND_RECORD_ERROR_KEY = 'NOT_FOUND_RECORD_ERROR'
// class
export class NOT_FOUND_RECORD_ERROR extends Error {
    constructor(message) {
        super(message);
        this.code = NOT_FOUND_RECORD_ERROR_KEY;
    }
}


/**
 * Delete record not found
 */
// P2025
// key
export const FORGEIN_KEY_ERROR_KEY = 'FORGEIN_KEY_ERROR'
// class
export class FORGEIN_KEY_ERROR extends Error {
    constructor(message) {
        super(message);
        this.code = FORGEIN_KEY_ERROR_KEY;
    }
}


export const AVAILABILITY_ERROR_KEY = 'NOT AVAILABLE IN THIS DATE RANGE';
export class AVAILABILITY_ERROR extends Error {
    constructor(message){
        super(message);
        this.code = AVAILABILITY_ERROR_KEY
    }
}