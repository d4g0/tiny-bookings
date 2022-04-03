
/**
 * Unique constraint
 */
// key
export const DB_UNIQUE_CONSTRAINT_ERROR_KEY = 'DB_UNIQUE_CONSTRAINT_ERROR';
// class
export class DB_UNIQUE_CONSTRAINT_ERROR extends Error {
    constructor(message) {
        super(message);
        this.code = DB_UNIQUE_CONSTRAINT_ERROR_KEY;
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