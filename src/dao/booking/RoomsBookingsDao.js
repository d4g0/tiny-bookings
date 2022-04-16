import { isValidBookingState, isValidId } from 'dao/utils';
import sql from 'db/postgres';


export async function createARoomBooking(room_id, booking_id) {
    if (!isValidId(room_id)) {
        throw new Error('Non valid room_id');
    }

    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking_id');
    }

    try {
        var rbRes = await sql`
        insert into
            rooms_bookings (room_id, booking_id)
        values
            (${room_id}, ${booking_id}) RETURNING *;
        `

        return rbRes[0];
    } catch (error) {
        throw error;
    }
}


export async function deleteARoomBooking(room_id, booking_id) {
    if (!isValidId(room_id)) {
        throw new Error('Non valid room_id');
    }

    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking_id');
    }

    try {
        var delRes = await sql`
            delete from 
                rooms_bookings rb 
            where rb.room_id = ${room_id} and rb.booking_id = ${booking_id} RETURNING *;
        `
        return delRes[0];
    } catch (error) {
        throw error;
    }
}