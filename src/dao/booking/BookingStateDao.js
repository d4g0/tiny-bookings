import { BOOKING_STATES, setBookingStateId } from 'dao/DBConstans';
import { isValidBookingState } from 'dao/utils';
import sql from 'db/postgres';


export async function createABookingState(booking_state) {
    if (!isValidBookingState(booking_state)) {
        throw new Error('Non valid booking_state')
    }

    try {
        var bookingStateRes = await sql`
            insert into
                booking_states (booking_state)
            values
                (${booking_state})
            RETURNING *;
        `
        return bookingStateRes[0]
    } catch (error) {
        throw error;
    }
}


export async function deleteABookingState(booking_state) {
    if (!isValidBookingState(booking_state)) {
        throw new Error('Non valid booking_state')
    }

    try {
        var delBookingStateRes = await sql`
            delete from booking_states where  booking_state = ${booking_state}
            RETURNING *;
        `
        return delBookingStateRes[0]
    } catch (error) {
        throw error;
    }
}

/**
 * Seed DB Constants Booking States
 * As Booking States should behave like 
 * Enums in db, but pgadmin erd tool don't 
 * cover those, and schema is been developed there
 * This secuence makes sure they required booking states constants
 * Are present, and set their relative ids in db for later
 * reuse.
 */
export async function initBookingStates() {
    try {

        // paid state
        var paidState = await getBookingStateByKey(BOOKING_STATES.PAID.key);
        if (!paidState) {
            paidState = await createABookingState(BOOKING_STATES.PAID.key);
        }
        setBookingStateId(paidState.booking_state, paidState.id);

        // cancel state
        var cancelState = await getBookingStateByKey(BOOKING_STATES.CANCEL.key);
        if (!cancelState) {
            cancelState = await createABookingState(BOOKING_STATES.CANCEL.key);
        }
        setBookingStateId(cancelState.booking_state, cancelState.id);


        // payment pending state
        var paymentPState = await getBookingStateByKey(BOOKING_STATES.PAYMENT_PENDING.key);
        if (!paymentPState) {
            paymentPState = await createABookingState(BOOKING_STATES.PAYMENT_PENDING.key);
        }
        setBookingStateId(paymentPState.booking_state, paymentPState.id);

    } catch (error) {
        throw error
    }
}

async function getBookingStateByKey(booking_state_key) {
    if (!isValidBookingState(booking_state_key)) {
        throw new Error('Non valid booking_state_key')
    }

    var bSRes = await sql`
        select * from booking_states bs where bs.booking_state = ${booking_state_key}
    `

    var bookingState = bSRes.length > 0 ? bSRes[0] : null;
    return bookingState;
}


export async function getBookingStates() {
    try {
        var bs = await sql`
            select * from booking_states;
        `

        return bs;
    } catch (error) {
        throw error
    }
}