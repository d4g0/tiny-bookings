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