const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR';

export class ValidationError extends Error {
    constructor(message, target) {
        super(message);

        this.code = VALIDATION_ERROR_CODE;
        this.target = target;

        this.extensions = {
            code: VALIDATION_ERROR_CODE,
            target: target,
        };
    }
}



const AVALIABILITY_ERROR_CODE = 'AVAILABILITY_ERROR';

export class AvailabilityError extends Error {
    constructor(message, target) {
        super(message);

        this.code = AVALIABILITY_ERROR_CODE;
        this.target = 'room_availability';

        this.extensions = {
            code: AVALIABILITY_ERROR_CODE,
            target: 'room_availability',
        };
    }
}