/**
    A `room_lock_period` is a period of time where a specific room it's not available to booking.
    Optionally this might happen for a certain `reason`, if not provided should be marked with
    a default `Blocked` reason.
    
    The dates are required to be in `UTC` time

    TODO
    Filter room locks by hotel id
    
 */

import sql from 'db/postgres';

import {
    isValidId,
    isValidInteger,
    isValidRoomLockReason,
    utcDate,
    getCurrentUTCDayDate,
    isValidDateInput,
    isValidPositiveInteger,
    isValidDateString,
} from 'dao/utils';

import { AVAILABILITY_ERROR } from 'dao/Errors';
import { isValid } from 'date-fns';
import { MAXIMUN_HOTEL_CALENDAR_LENGHT } from 'dao/DBConstans';
import { ValidationError } from 'apollo-server-core';

/**
 * Create A Room Lock Period
 *
 * Params:
 * `room_id` !
 * `reason`
 * `start_date` !
 * `end_date`   !
 *  hotel_maximun_free_calendar_days
 */
export async function createARoomLockPeriod({
    room_id,
    reason = 'Default Reason', // default since it's optional
    start_date = new Date().toISOString(),
    end_date = new Date().toISOString(),
    is_a_booking = false,
    booking_id = null,
}) {
    try {
        function validate() {
            if (!isValidId(room_id)) {
                throw new Error('Non valid room_id: ' + room_id);
            }

            if (reason && !isValidRoomLockReason(reason)) {
                throw new Error('Non valid reason: ' + reason);
            }

            if (!isValidDateString(start_date)) {
                throw new ValidationError('Non valid date str', 'start_date');
            }

            if (!isValidDateInput(end_date)) {
                throw new ValidationError('Non valid date str', 'end_date');
            }

            if (booking_id && !isValidId(booking_id)) {
                throw new Error('Non valid booking id');
            }
        }
        validate();

        // generate dates to save
        var js_start_date = new Date(start_date);
        var js_end_date = new Date(end_date);

        // console.log({
        //     js_start_date: js_start_date.toISOString(),
        //     js_end_date: js_end_date.toISOString(),
        // });

        var currentUTCDayDate = getCurrentUTCDayDate();

        // check that if there is avalailability for the lock
        // defered for NOW TODO

        // check start_date is less then end_date
        if (js_start_date > js_end_date) {
            throw new ValidationError(
                'The end date has to be greater then the start date',
                '{start,end}_date'
            );
        }

        // check if end it's inside current hotel calendar
        // generate the last hotel calendar day date
        // by suming calendar length days to current day date
        const MILISECONDS_IN_A_DAY = 86400000;
        const LAST_HOTEL_CALENDAR_DAY_DATE = new Date(
            currentUTCDayDate.valueOf() +
                MAXIMUN_HOTEL_CALENDAR_LENGHT * MILISECONDS_IN_A_DAY
        );

        if (!(js_end_date.valueOf() <= LAST_HOTEL_CALENDAR_DAY_DATE.valueOf())) {
            throw new ValidationError(
                'End date outbounds the hotel calendar',
                'end_date'
            );
        }

        // check if is availability for the locking
        var isAvailable = await isRoomAvailableIn({
            room_id,
            delta_search_days: MAXIMUN_HOTEL_CALENDAR_LENGHT,
            start_date,
            end_date,
        });

        if (!isAvailable[0].is_available) {
            throw new AVAILABILITY_ERROR('Room Not Available');
        }

        // all cristal clear lets save

        var res;
        var during = `[${start_date}, ${end_date}]`;

        // save to db
        // non booking case
        if (!is_a_booking) {
            res = await sql`
            insert into
                room_lock_period (
                    room_id, 
                    start_date, 
                    end_date, 
                    reason,
                    during
                )
            values
                (
                    ${room_id},
                    ${start_date},
                    ${end_date},
                    ${reason},
                    ${during}
                ) RETURNING *;
            `;
        }

        // booking case
        else {
            res = await sql`
            insert into
                room_lock_period (
                    room_id,
                    start_date,
                    end_date,
                    reason,
                    during,
                    is_a_booking,
                    booking_id
                )
            values
                (
                    ${room_id},
                    ${start_date},
                    ${end_date},
                    ${reason},
                    ${during},
                    ${true},
                    ${booking_id}
                ) RETURNING *;
            `;
        }
        return res[0];
    } catch (error) {
        throw error;
    }
}

export async function deleteRoomLockPeriod(room_lock_period_id) {
    if (!isValidId(room_lock_period_id)) {
        throw new Error('Non valid room_lock_period_id: ' + room_lock_period_id);
    }

    try {
        var delRes = await sql`
        delete from room_lock_period rlp where rlp.id = ${room_lock_period_id} returning *
        `;
        return delRes[0];
    } catch (error) {
        throw error;
    }
}

export async function isRoomAvailableIn_date_str({
    room_id,
    delta_search_days,
    start_date = new Date().toISOString(),
    end_date = new Date().toISOString(),
}) {
    // dates
    if (!isValidDateString(start_date)) {
        throw new ValidationError('Non valid date string', 'start_date');
    }
    if (!isValidDateString(end_date)) {
        throw new ValidationError('Non valid date string', 'end_date');
    }

    try {
        var during = `[${start_date}, ${end_date}]`;
        var result = await sql`
            select is_available from is_room_available_in (
                ${room_id}, 
                ${delta_search_days},
                ${during}
            );
        `;

        return result;
    } catch (error) {
        throw error;
    }
}

export async function getRoomLocks({
    start_date_filter = { year, month, day, hour, minute },
    end_date_filter = { year, month, day, hour, minute },
    page = 1, // 1 start based count
    hotel_id,
}) {
    // validation
    if (!isValidDateInput(start_date_filter)) {
        throw new Error('Non valid start_date_filter');
    }
    if (!isValidDateInput(end_date_filter)) {
        throw new Error('Non valid end_date_filter');
    }
    if (!isValidPositiveInteger(page)) {
        throw new Error('Non valid page, positive integer expected');
    }

    if (!isValidId(hotel_id)) {
        throw new Error('Non valid hotel id');
    }

    const LIMIT = 50;
    const OFFSET = (page - 1) * LIMIT;

    var utc_start_date_filter = utcDate({
        year: start_date_filter.year,
        month: start_date_filter.month,
        day: start_date_filter.day,
        hour: start_date_filter.hour,
        minute: start_date_filter.minute,
    });
    var utc_end_date_filter = utcDate({
        year: end_date_filter.year,
        month: end_date_filter.month,
        day: end_date_filter.day,
        hour: end_date_filter.hour,
        minute: end_date_filter.minute,
    });

    try {
        var room_locks_res = await sql`
        select 
            rlp.* 
        from 
            room_lock_period rlp
        join room rm 
        on rlp.room_id = rm.id
        join hotel ht
        on rm.hotel_id = ht.id 
        where 
            rlp.start_date >= ${utc_start_date_filter.toISOString()}
        and
            rlp.start_date <= ${utc_end_date_filter.toISOString()}
        and ht.id = ${hotel_id}
        ORDER BY rlp.start_date desc
        LIMIT ${LIMIT} OFFSET ${OFFSET} ;
        `;

        var countRes = await sql`
        select 
            count(*) 
        from 
            room_lock_period rlp
        join room rm 
        on rlp.room_id = rm.id
        join hotel ht
        on rm.hotel_id = ht.id 
        where 
            rlp.start_date >= ${utc_start_date_filter.toISOString()}
        and
            rlp.start_date <= ${utc_end_date_filter.toISOString()}
        and ht.id = ${hotel_id}
        `;

        var results = room_locks_res;
        var count = +countRes[0].count;

        return {
            results,
            count,
        };
    } catch (error) {
        throw error;
    }
}

export async function getRoomLocks_date_str({
    start_date_filter = new Date().toISOString(),
    end_date_filter = new Date().toISOString(),
    page = 1, // 1 start based count
    hotel_id,
}) {
    // validation
    if (!isValidDateString(start_date_filter)) {
        throw new ValidationError('Non valid date str', 'start_date_filter');
    }
    if (!isValidDateString(end_date_filter)) {
        throw new ValidationError('Non valid date str', 'end_date_filter');
    }
    if (!isValidPositiveInteger(page)) {
        throw new Error('Non valid page, positive integer expected');
    }

    if (!isValidId(hotel_id)) {
        throw new Error('Non valid hotel id');
    }

    const LIMIT = 50;
    const OFFSET = (page - 1) * LIMIT;

    try {
        var room_locks_res = await sql`
        select 
            rlp.* 
        from 
            room_lock_period rlp
        join room rm 
        on rlp.room_id = rm.id
        join hotel ht
        on rm.hotel_id = ht.id 
        where 
            rlp.start_date >= ${start_date_filter}
        and
            rlp.start_date <= ${end_date_filter}
        and ht.id = ${hotel_id}
        ORDER BY rlp.start_date desc
        LIMIT ${LIMIT} OFFSET ${OFFSET} ;
        `;

        var countRes = await sql`
        select 
            count(*) 
        from 
            room_lock_period rlp
        join room rm 
        on rlp.room_id = rm.id
        join hotel ht
        on rm.hotel_id = ht.id 
        where 
            rlp.start_date >= ${start_date_filter}
        and
            rlp.start_date <= ${end_date_filter}
        and ht.id = ${hotel_id}
        `;

        var results = room_locks_res;
        var count = +countRes[0].count;

        return {
            results,
            count,
        };
    } catch (error) {
        throw error;
    }
}

export async function getARoomIsLocks({
    start_date_filter = { year, month, day, hour, minute },
    end_date_filter = { year, month, day, hour, minute },
    page = 1, // 1 start based count
    room_id_filter,
}) {
    // validation
    if (!isValidDateInput(start_date_filter)) {
        throw new Error('Non valid start_date_filter');
    }
    if (!isValidDateInput(end_date_filter)) {
        throw new Error('Non valid end_date_filter');
    }
    if (!isValidPositiveInteger(page)) {
        throw new Error('Non valid page, positive integer expected');
    }
    if (!isValid(room_id_filter)) {
        throw new Error('Non valid room_id_filter');
    }

    const LIMIT = 50;
    const OFFSET = (page - 1) * LIMIT;

    var utc_start_date_filter = utcDate({
        year: start_date_filter.year,
        month: start_date_filter.month,
        day: start_date_filter.day,
        hour: start_date_filter.hour,
        minute: start_date_filter.minute,
    });
    var utc_end_date_filter = utcDate({
        year: end_date_filter.year,
        month: end_date_filter.month,
        day: end_date_filter.day,
        hour: end_date_filter.hour,
        minute: end_date_filter.minute,
    });

    try {
        var room_locks_res = await sql`
        select 
            * 
        from 
            room_lock_period rlp 
        where 
            rlp.start_date >= ${utc_start_date_filter.toISOString()}
        and
            rlp.start_date <= ${utc_end_date_filter.toISOString()}
        and
            rlp.room_id = ${room_id_filter}
        ORDER BY rlp.start_date
        LIMIT ${LIMIT} OFFSET ${OFFSET} ;
        `;

        var countRes = await sql`
        select 
            count(*) 
        from 
            room_lock_period rlp 
        where 
            rlp.start_date >= ${utc_start_date_filter.toISOString()}
        and
            rlp.start_date <= ${utc_end_date_filter.toISOString()}
        and
            rlp.room_id = ${room_id_filter}
        `;

        var results = room_locks_res;
        var count = +countRes[0].count;

        return {
            results,
            count,
        };
    } catch (error) {
        throw error;
    }
}

export async function getRoomLocksByBookingId(booking_id) {
    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking id');
    }

    try {
        var roomLocks = await sql`
            select  * from room_lock_period rlp where rlp.booking_id = ${booking_id};
        `;

        return roomLocks;
    } catch (error) {
        throw error;
    }
}

export async function deleteRoomLocksByBookingId(booking_id) {
    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking id');
    }

    try {
        var roomLocks = await sql`
            delete from room_lock_period rlp where rlp.booking_id = ${booking_id} RETURNING *;
        `;

        return roomLocks;
    } catch (error) {
        throw error;
    }
}

export async function getRoomLockById(room_lock_id) {
    if (!isValidId(room_lock_id)) {
        throw new ValidationError('Non valid id: ', 'room_lock_id');
    }

    try {
        const rlRes = await sql`
            select * from room_lock_period rlp where rlp.id = ${room_lock_id};
        `;
        const roomLock = rlRes.length ? rlRes[0] : null;
        return roomLock;
    } catch (error) {
        throw error;
    }
}

// deprecated
export async function isRoomAvailableIn({
    room_id,
    delta_search_days,
    start_date = {
        year,
        month,
        day,
        hour,
        minute,
    },
    end_date = {
        year,
        month,
        day,
        hour,
        minute,
    },
}) {
    var utc_start_date = utcDate({
        year: start_date.year,
        month: start_date.month,
        day: start_date.day,
        hour: start_date.hour,
        minute: start_date.minute,
    });

    var utc_end_date = utcDate({
        year: end_date.year,
        month: end_date.month,
        day: end_date.day,
        hour: end_date.hour,
        minute: end_date.minute,
    });

    try {
        var during = `[${utc_start_date.toISOString()}, ${utc_end_date.toISOString()}]`;
        var result = await sql`
            select is_available from is_room_available_in (
                ${room_id}, 
                ${delta_search_days},
                ${during}
            );
        `;

        return result;
    } catch (error) {
        throw error;
    }
}

export async function deleteARoomLock(room_lock_id) {
    if (!isValidId(room_lock_id)) {
        throw new ValidationError('Non valid id', 'room_lock_id');
    }
    try {
        const delRes = await sql`
        delete from room_lock_period where id = ${room_lock_id} returning *;
        `;
        const res = delRes.length
            ? { completed: true, count: 1 }
            : { completed: true, count: 0 };

        return res;
    } catch (error) {
        throw error;
    }
}
