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


import { prisma } from 'dao/PrismaClient.js';
import {
    isValidId,
    isValidInteger,
    isValidRoomLockReason,
    isValidYearMonthDayDate,
    isValidHourTime,
    isValidHourTime2,
    utcDate,
    getCurrentUTCDayDate
} from 'dao/utils';



/**
 * Create A Room Lock Period
 * 
 * Params:
 * `room_id` !
 * `reason`
 * `start_date` !
 * `end_date`   !
 *  hotel_maximun_free_calendar_days
 *  hotel_check_in_time
 *  hotel_check_out_time
 * 
 * Attemps to create a `room_lock_period` record in db
 * 
 * Throws NotFound errors if the room or hotel does not exists
 * Throws Validation errors if `start or end dates`  upbounds or downbounds 
 * the required limits
 * 
 * Algorithm
 * 
 * Validate Params
 * Static validation of 
 *      room_id , 
 *      reason if present, 
 *      start_date, end_date and hotel_calendar_end_date
 *      hotel_check_in_time and hotel_check_out_time
 * * Calculate valid time interval and check if date bounds are inside
 *      Throw if not
 *   Proceed to save if cristal clear
 *   Retunr the saved record
 */
export async function createARoomLockPeriod({
    room_id,
    reason = null, // default since it's optional
    start_date = { year, month, day },
    end_date = { year, month, day },
    hotel_calendar_length,
    hotel_check_in_time = { hour, minute },
    hotel_check_out_time = { hour, minute },
}) {

    try {




        function validate() {
            if (!isValidId(room_id)) {
                throw new Error('Non valid room_id: ' + room_id)
            }

            if (reason && !isValidRoomLockReason(reason)) {
                throw new Error('Non valid reason: ' + reason)
            }

            if (!isValidYearMonthDayDate(start_date)) {
                throw new Error('Non valid start_date')
            }

            if (!isValidYearMonthDayDate(end_date)) {
                throw new Error('Non valid end_date')
            }

            if (!isValidInteger(hotel_calendar_length) || hotel_calendar_length < 1) {
                throw new Error('Non valid hotel_calendar_length: ' + hotel_calendar_length);
            }

            if (!isValidHourTime2(hotel_check_in_time)) {
                throw new Error('Non valid hotel_check_in_time')
            }

            if (!isValidHourTime2(hotel_check_out_time)) {
                throw new Error('Non valid hotel_check_out_time')
            }

            // validate start date
            // generate a start_date UTC Date obj with provided values
            // init a current UTC Date
            // check start_date Date is greater or equal then current utc_date Date


        }
        validate();

        var utc_start_date, utc_end_date, currentUTCDayDate,
            utc_start_day_date, utc_end_day_date;



        utc_start_day_date = utcDate({
            year: start_date.year,
            month: start_date.month,
            day: start_date.day,
        });


        utc_end_day_date = utcDate({
            year: end_date.year,
            month: end_date.month,
            day: end_date.day,
        });


        currentUTCDayDate = getCurrentUTCDayDate();
        // check that if there is avalailability for the lock
        // defered for NOW TODO
        // check if start_date is a future or current date
        if (!(utc_start_day_date.valueOf() >= currentUTCDayDate.valueOf())) {
            throw new Error('Start Date has to be a future or current day date')
        }
        // check start_date is less then end_date in at least
        // one minimal_room_service_interval unit 1d
        const MILISECONDS_IN_A_DAY = 86400000;
        if (!(utc_end_day_date - utc_start_day_date >= MILISECONDS_IN_A_DAY)) {
            throw new Error('There is not valid (minimal 1 day) interval beteewn start and end day dates');
        }

        // check if end it's inside current hotel calendar
        // generate the last hotel calendar day date
        // by suming calendar length days to current day date
        const LAST_HOTEL_CALENDAR_DAY_DATE = new Date(currentUTCDayDate.valueOf() + (hotel_calendar_length * MILISECONDS_IN_A_DAY));

        if (!(utc_end_day_date.valueOf() <= LAST_HOTEL_CALENDAR_DAY_DATE.valueOf())) {
            throw new Error('End date outbounds the hotel calendar');
        }


        // all cristal clear lets save

        // generate dates to save
        utc_start_date = utcDate({
            year: start_date.year,
            month: start_date.month,
            day: start_date.day,
            hour: hotel_check_in_time.hour,
            minute: hotel_check_in_time.minute
        });
        utc_end_date = utcDate({
            year: end_date.year,
            month: end_date.month,
            day: end_date.day,
            hour: hotel_check_out_time.hour,
            minute: hotel_check_out_time.minute
        });


        // save to db

        var room_lock_period = await prisma.room_lock_period.create({
            data: {
                room_id,
                reason,
                start_date: utc_start_date,
                end_date: utc_end_date
            }
        })

        return room_lock_period;




    } catch (error) {
        throw error
    }

}

