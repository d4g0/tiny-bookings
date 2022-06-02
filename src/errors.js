const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR'

export class ValidationError extends Error {
    constructor(message, target) {
        super(message);
        this.code = VALIDATION_ERROR_CODE;
        this.target = target
    }
}