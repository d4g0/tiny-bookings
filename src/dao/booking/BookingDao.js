import { isValidDateInput, isValidId, isValidPositiveInteger, isValidPrice, utcDate } from 'dao/utils';
import sql from 'db/postgres';

/**
 * TODO Implement a service that handle 
 * all dependencies creations availability verification a so fort
 */
export async function createBooking({
    client_id,
    hotel_id,
    booking_state_id,
    total_price,
    start_date = { year, month, day, hour, minute },
    end_date = { year, month, day, hour, minute },
    number_of_guests
}) {
    try {

        function validate() {
            if (!isValidId(client_id)) {
                throw new Error('Non valid client_id')
            }
            if (!isValidId(hotel_id)) {
                throw new Error('Non valid hotel_id')
            }
            if (!isValidId(booking_state_id)) {
                throw new Error('Non valid booking_state_id')
            }

            if (!isValidPrice(total_price)) {
                throw new Error('Non valid total_price')
            }
            if (!isValidDateInput(start_date)) {
                throw new Error('Non valid start_date')
            }
            if (!isValidDateInput(end_date)) {
                throw new Error('Non valid end_date')
            }
            if (!isValidPositiveInteger(number_of_guests)) {
                throw new Error('Non valid number_of_guests')
            }

        }
        validate();

        var utc_start_date = utcDate({
            year: start_date.year,
            month: start_date.month,
            day: start_date.day,
            hour: start_date.hour,
            minute: start_date.minute
        });
        var utc_end_date = utcDate({
            year: end_date.year,
            month: end_date.month,
            day: end_date.day,
            hour: end_date.hour,
            minute: end_date.minute
        });


        if (utc_start_date > utc_end_date) {
            throw new Error('The end date has to be greater then the start date');
        }


        var bookingRes = await sql`
            insert into
                booking (
                    client_id,
                    hotel_id,
                    booking_state,
                    total_price,
                    start_date,
                    end_date,
                    number_of_guests
                )
            values
                (
                    ${client_id},
                    ${hotel_id},
                    ${booking_state_id},
                    ${total_price},
                    ${utc_start_date.toISOString()},
                    ${utc_end_date.toISOString()},
                    ${number_of_guests}
                ) RETURNING *;
        `
        // numeric postgres type to js number mapping
        var booking = bookingRes[0];
        booking.total_price = +booking.total_price;
        return booking;
    } catch (error) {
        throw error;
    }
}


export async function deleteBooking(booking_id) {
    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking_id')
    }
    try {
        var delRes = await sql`
            delete from booking b where b.id = ${booking_id} returning *;
        `
        return delRes[0];
    } catch (error) {
        throw error
    }
}

export async function updateBookingState(booking_id, new_booking_state) {
    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking_id')
    }

    if (!isValidId(new_booking_state)) {
        throw new Error('Non valid new_booking_state')
    }

    try {
        var updateRes = await sql`
        update  
            booking  
        set booking_state = ${new_booking_state} 
        where id = ${booking_id} 
        returning *
        `
        var updatedBooking = updateRes[0];
        updatedBooking.total_price = +updatedBooking.total_price;
        return updatedBooking;
    } catch (error) {
        throw error;
    }
}

export async function updateBookingAsCancel(booking_id, cancel_state_id) {
    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking_id')
    }

    if (!isValidId(cancel_state_id)) {
        throw new Error('Non valid cancel_state_id')
    }

    try {
        var updateRes = await sql`
        update  
            booking  
        set booking_state = ${cancel_state_id}, is_cancel = true 
        where id = ${booking_id} 
        returning *
        `
        var updatedBooking = updateRes[0];
        updatedBooking.total_price = +updatedBooking.total_price;
        return updatedBooking;
    } catch (error) {
        throw error;
    }
}

export async function getBookings({
    start_date_filter = { year, month, day, hour, minute },
    end_date_filter = { year, month, day, hour, minute },
    page = 1, // 1 start based count
    hotel_id,
}) {
    // validation
    if (!isValidDateInput(start_date_filter)) {
        throw new Error('Non valid start_date_filter')
    }
    if (!isValidDateInput(end_date_filter)) {
        throw new Error('Non valid end_date_filter')
    }
    if (!isValidPositiveInteger(page)) {
        throw new Error('Non valid page, positive integer expected')
    }

    if(!isValidId(hotel_id)){
        throw new Error('Non valid hotel id');
    }

    const LIMIT = 50;
    const OFFSET = (page - 1) * LIMIT;

    var utc_start_date_filter = utcDate({
        year: start_date_filter.year,
        month: start_date_filter.month,
        day: start_date_filter.day,
        hour: start_date_filter.hour,
        minute: start_date_filter.minute
    });
    var utc_end_date_filter = utcDate({
        year: end_date_filter.year,
        month: end_date_filter.month,
        day: end_date_filter.day,
        hour: end_date_filter.hour,
        minute: end_date_filter.minute
    });

    try {
        var bookingsRes = await sql`
            select 
                *
            from 
                booking b
            where 
                b.start_date >= ${utc_start_date_filter.toISOString()}
            and
                b.start_date <= ${utc_end_date_filter.toISOString()}
            and b.hotel_id = ${hotel_id}
            ORDER BY b.start_date desc
            LIMIT ${LIMIT} OFFSET ${OFFSET};
        `;

        var countRes = await sql`
            select 
                count(*) 
            from 
                booking b
            where 
                b.start_date >= ${utc_start_date_filter.toISOString()}
            and
                b.start_date <= ${utc_end_date_filter.toISOString()}
            and b.hotel_id = ${hotel_id}
        `;

        // map numeric goted string to number
        // db total_price scale constrain sould make sure
        // incoming numeric strings fit into the 
        // javascript Number class
        for (let i = 0; i < bookingsRes.length; i++) {
            bookingsRes[i].total_price = +bookingsRes[i].total_price
        }

        var results = bookingsRes;
        var count = +countRes[0].count;

        return {
            results,
            count
        }
    } catch (error) {
        throw error
    }
}


export async function getBookingsByClient({
    client_id,
    start_date_filter = { year, month, day, hour, minute },
    end_date_filter = { year, month, day, hour, minute },
    page = 1, // 1 start based count
}) {
    // validation
    if (!isValidId(client_id)) {
        throw new Error('Non valid client_id')
    }
    if (!isValidDateInput(start_date_filter)) {
        throw new Error('Non valid start_date_filter')
    }
    if (!isValidDateInput(end_date_filter)) {
        throw new Error('Non valid end_date_filter')
    }
    if (!isValidPositiveInteger(page)) {
        throw new Error('Non valid page, positive integer expected')
    }

    const LIMIT = 50;
    const OFFSET = (page - 1) * LIMIT;

    var utc_start_date_filter = utcDate({
        year: start_date_filter.year,
        month: start_date_filter.month,
        day: start_date_filter.day,
        hour: start_date_filter.hour,
        minute: start_date_filter.minute
    });
    var utc_end_date_filter = utcDate({
        year: end_date_filter.year,
        month: end_date_filter.month,
        day: end_date_filter.day,
        hour: end_date_filter.hour,
        minute: end_date_filter.minute
    });

    try {
        var bookingsRes = await sql`
            select 
                *
            from 
                booking b
            where 
                b.start_date >= ${utc_start_date_filter.toISOString()}
            and
                b.start_date <= ${utc_end_date_filter.toISOString()}
            and 
                b.client_id = ${client_id}
            ORDER BY b.start_date
            LIMIT ${LIMIT} OFFSET ${OFFSET};
        `;

        var countRes = await sql`
            select 
                count(*) 
            from 
                booking b
            where 
                b.start_date >= ${utc_start_date_filter.toISOString()}
            and
                b.start_date <= ${utc_end_date_filter.toISOString()}
            and 
                b.client_id = ${client_id} ;
        `;

        // map numeric goted string to number
        // db total_price scale constrain sould make sure
        // incoming numeric strings fit into the 
        // javascript Number class
        for (let i = 0; i < bookingsRes.length; i++) {
            bookingsRes[i].total_price = +bookingsRes[i].total_price
        }

        var results = bookingsRes;
        var count = +countRes[0].count;

        return {
            results,
            count
        }
    } catch (error) {
        throw error
    }
}

