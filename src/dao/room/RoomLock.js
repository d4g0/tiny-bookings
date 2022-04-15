/**


    A `room_lock_period` is a period of time where a specific room it's not available to booking.
    Optionally this might happen for a certain `reason`, if not provided should be marked with
    a default `Blocked` reason.
    
    A `room_service_interval` is an interval of time wish start in a 
    specific day with the check_in_hour_time of the hotel, 
    and finish in a later day with the check_out_hour_time of the hotel.

    The `minimal_room_service_interval` it's the minimal unit of time where a room it's able 
    to provide service, it's composed of:
    start_date [day + check_in_hour_time] 
    a night [in beteewn] and 
    the end_date [ [start_date.day + 1] + check_out_hour_time ]

    The `maximal_room_service_interval` it's the maxmiun interval of `room_serice_intervals`
    calculated dynamically bounded for
    start: current minimal_room_service_interval start 
            (present day fixed) [today : check_int_hour_time]
    end: latest minimal_room_service_interval end 
            (fixed by the hotel free calendar days) [last_calendar_day : check_out_hour_time]

    Since the hour_time of the start and end dates of the lock_period are fixed by hotel 
    definition they will be mapped to a `room_service_iterval` bounds
    


    `start_date` day
    Has to be equal or greater then the present day date
    Has to be less then the the `end_date` day
    
    `end_date` day
    has to be less then or equal to the maximun_room_service_interval is end bound date day
    
    
    and not greater then the day where calendar days stops aka: 
    the computed date interval of the current date and the room it's maximun hotel_check_out_date 
    computed with the hotel_check_out_time and maximun free calendar days.
    
    
    A room_lock is delimitation start and end date can be updated, as long as 
    they comply the same bounds of their definition above.


    The dates are required to be in `UTC` time






    // map check in dates hour time from hotel local time to utc



 * 
 */


import sql from '~/dao/postgres';

import {
    isValidId,
    isValidInteger,
    isValidRoomLockReason,
    utcDate,
    getCurrentUTCDayDate,
    isValidDateInput
} from 'dao/utils';

import { AVAILABILITY_ERROR } from 'dao/Errors';



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
    start_date = { year, month, day, hour, minute },
    end_date = { year, month, day, hour, minute },
    hotel_calendar_length,
    is_a_booking = false,
    booking_id = null
}) {

    try {




        function validate() {
            if (!isValidId(room_id)) {
                throw new Error('Non valid room_id: ' + room_id)
            }

            if (reason && !isValidRoomLockReason(reason)) {
                throw new Error('Non valid reason: ' + reason)
            }

            if (!isValidDateInput(start_date)) {
                throw new Error('Non valid start_date')
            }

            if (!isValidDateInput(end_date)) {
                throw new Error('Non valid end_date')
            }

            if (!isValidInteger(hotel_calendar_length) || hotel_calendar_length < 1) {
                throw new Error('Non valid hotel_calendar_length: ' + hotel_calendar_length);
            }



        }
        validate();


        // generate dates to save
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


        var currentUTCDayDate = getCurrentUTCDayDate();

        // check that if there is avalailability for the lock
        // defered for NOW TODO

        // check start_date is less then end_date 
        if (utc_start_date > utc_end_date) {
            throw new Error('The end date has to be greater then the start date');
        }

        // check if end it's inside current hotel calendar
        // generate the last hotel calendar day date
        // by suming calendar length days to current day date
        const MILISECONDS_IN_A_DAY = 86400000;
        const LAST_HOTEL_CALENDAR_DAY_DATE = new Date(currentUTCDayDate.valueOf() + (hotel_calendar_length * MILISECONDS_IN_A_DAY));

        if (!(utc_end_date.valueOf() <= LAST_HOTEL_CALENDAR_DAY_DATE.valueOf())) {
            throw new Error('End date outbounds the hotel calendar');
        }


        // check if is availability for the locking
        var isAvailable = await isRoomAvailableIn({
            room_id,
            delta_search_days: hotel_calendar_length,
            start_date,
            end_date
        })
        if (!isAvailable[0].is_available) {
            throw new AVAILABILITY_ERROR('Room Not Available');
        }



        // all cristal clear lets save

        var res;
        var during = `[${utc_start_date.toISOString()}, ${utc_end_date.toISOString()}]`;
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
                    ${utc_start_date.toISOString()},
                    ${utc_end_date.toISOString()},
                    ${reason},
                    ${during}
                ) RETURNING *;
            `
        }

        // booking case

        // room_lock_period = await sql`
        // insert into
        //     room_lock_period (
        //         room_id,
        //         start_date,
        //         end_date,
        //         reason,
        //         during,
        //         is_a_booking,
        //         booking_id
        //     )
        // values
        //     (
        //         1,
        //         '2022-04-17T00:00:00.000Z',
        //         '2022-04-16T00:00:00.000Z',
        //         'Booked',
        //         '[2022-04-17T00:00:00.000Z, 2022-04-19T00:00:00.000Z]',
        //         true,
        //         1
        //     );
        // `

        return res[0];




    } catch (error) {
        throw error
    }

}


export async function deleteRoomLockPeriod(room_lock_period_id) {
    if (!isValidId(room_lock_period_id)) {
        throw new Error('Non valid room_lock_period_id: ' + room_lock_period_id);
    }

    try {

        var delRes = await sql`
        delete from room_lock_period rlp where rlp.id = ${room_lock_period_id} returning *
        `
        return delRes[0];
    } catch (error) {
        throw error
    }
}


export async function isRoomAvailableIn({
    room_id,
    delta_search_days,
    start_date = {
        year,
        month,
        day,
        hour,
        minute
    },
    end_date = {
        year,
        month,
        day,
        hour,
        minute
    }
}) {
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

        throw error
    }
}
