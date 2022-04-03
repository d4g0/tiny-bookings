export const DB_UNIQUE_CONSTRAINT_ERROR_KEY = 'DB_UNIQUE_CONSTRAINT_ERROR';

export class DB_UNIQUE_CONSTRAINT_ERROR extends Error {
    constructor(message) {
        super(message);
        this.code = DB_UNIQUE_CONSTRAINT_ERROR_KEY;
    }
}