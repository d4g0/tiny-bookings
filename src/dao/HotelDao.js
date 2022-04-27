import sql from 'db/postgres'
import { prisma } from 'db/PrismaClient.js'
import { DB_UNIQUE_CONSTRAINT_ERROR, NOT_FOUND_RECORD_ERROR } from './Errors'
import { hourTimeToSQLTimeStr, isValidHotelName, isValidHourTime, isValidHourTimeInput, isValidId, isValidInteger, isValidTimeZone } from './utils'


/**
 * TODO
 * Convert hotel id to integer
 */



/**
 * Creates a Hotel in DB
 * `check_in_hour_time // hour_time { hours: 0 - 24 , minutes: 0 - 59 }
 * Throws dbErrors:
 * 
 */
export async function createHotel({
    hotel_name,
    maximun_free_calendar_days,
    check_in_hour_time = { hours, minutes },
    check_out_hour_time = { hours, minutes },
    minimal_prev_days_to_cancel,
    iana_time_zone
}) {

    // validate
    if (!isValidHotelName(hotel_name)) {
        throw new Error(`Non valid string provided: ${hotel_name}`)
    }
    if (!isValidInteger(maximun_free_calendar_days)) {
        throw new Error(`Non valid integer provided: ${maximun_free_calendar_days}`)
    }

    if (!isValidHourTimeInput(check_in_hour_time)) {
        throw new Error(`Non valid check_in_hour_time provided`)
    }

    if (!isValidHourTimeInput(check_out_hour_time)) {
        throw new Error(`Non valid check_in_hour_time provided`)
    }

    if (!isValidInteger(minimal_prev_days_to_cancel)) {
        throw new Error(`Non valid minimal_prev_days_to_cancel integer provided: ${minimal_prev_days_to_cancel}`)
    }

    if (!isValidTimeZone(iana_time_zone)) {
        throw new Error('Non Valid Time Zone provided')
    }


    // map hour time objs to sql time string
    check_in_hour_time = hourTimeToSQLTimeStr(check_in_hour_time);
    check_out_hour_time = hourTimeToSQLTimeStr(check_out_hour_time);


    try {
        // create
        var hotelRes = await await sql`
        insert into
            hotel (
                hotel_name,
                maximun_free_calendar_days,
                minimal_prev_days_to_cancel,
                check_in_hour_time,
                check_out_hour_time,
                iana_time_zone
            )
        values
            (
                ${hotel_name},
                ${maximun_free_calendar_days},
                ${minimal_prev_days_to_cancel},
                ${check_in_hour_time},
                ${check_out_hour_time},
                ${iana_time_zone}
            ) returning *;
        `

        var hotel = hotelRes.length > 0 ? hotelRes[0] : null;

        return hotel;

    } catch (error) {
        // handle know errors
        // unique constraint
        if (error?.code == '23505') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Duplicated Hotel name')
        }
        // default hanlding
        throw error;
    }
}

export async function getHotelById(hotelId) {
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }

    try {
        var hotelRes = await sql`
            select * from hotel where hotel.id = ${hotelId};
        `

        var hotel = hotelRes.length > 0 ? hotelRes[0] : null;
        return hotel;
    } catch (error) {
        throw error
    }
}

export async function deleteHotelById(hotelId) {
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }

    try {
        var delRes = await sql`
            delete from hotel where hotel.id = ${hotelId} returning *;
        `
        var hotel = delRes.length > 0 ? delRes[0] : null;
        return hotel
    } catch (error) {
        throw error
    }
}

export async function getHotels() {
    try {
        var hotelRes = await sql`
            select * from hotel order by hotel.id
        `;
        return hotelRes;
    } catch (error) {
        throw error;
    }
}


export async function updateHotelName(hotelId, hotelName) {

    // validate
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }
    if (!isValidHotelName(hotelName)) {
        throw new Error('Non Valid Hotel Name');
    }

    try {
        var updatedRes = await prisma.hotel.update({
            where: {
                id: hotelId
            },
            data: {
                hotel_name: hotelName
            }
        })

        return mapHotelResToHotel(updatedRes);
    } catch (error) {
        throw error;
    }
}

export async function updateHotelCheckInTime(hotelId, check_in_hour_time) {

    // validate
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }
    if (!isValidHourTime(check_in_hour_time)) {
        throw new Error(`Non valid check_in_hour_time provided`)
    }

    try {
        var updatedRes = await prisma.hotel.update({
            where: {
                id: hotelId
            },
            data: {
                check_in_hour_time
            }
        })

        return mapHotelResToHotel(updatedRes);
    } catch (error) {
        throw error;
    }
}

export async function updateHotelCheckOutTime(hotelId, check_out_hour_time) {

    // validate
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }
    if (!isValidHourTime(check_out_hour_time)) {
        throw new Error(`Non valid check_out_hour_time provided`)
    }

    try {
        var updatedRes = await prisma.hotel.update({
            where: {
                id: hotelId
            },
            data: {
                check_out_hour_time
            }
        })

        return mapHotelResToHotel(updatedRes);
    } catch (error) {
        throw error;
    }
}


export async function updateHotelFreeCalendarDays(hotelId, maximun_free_calendar_days) {

    // validate
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }
    if (!isValidInteger(maximun_free_calendar_days)) {
        throw new Error(`Non valid maximun_free_calendar_days provided`)
    }

    try {
        var updatedRes = await prisma.hotel.update({
            where: {
                id: hotelId
            },
            data: {
                maximun_free_calendar_days
            }
        })

        return mapHotelResToHotel(updatedRes);
    } catch (error) {
        throw error;
    }
}

export async function updateHotelDaysToCancel(hotelId, minimal_prev_days_to_cancel) {

    // validate
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }

    if (!isValidInteger(minimal_prev_days_to_cancel)) {
        throw new Error(`Non valid minimal_prev_days_to_cancel integer provided: ${minimal_prev_days_to_cancel}`)
    }

    try {
        var updatedRes = await prisma.hotel.update({
            where: {
                id: hotelId
            },
            data: {
                minimal_prev_days_to_cancel
            }
        })

        return mapHotelResToHotel(updatedRes);
    } catch (error) {
        throw error;
    }
}

export async function updateHotelTimeZone(hotelId, iana_time_zone) {

    // validate
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }
    if (!isValidTimeZone(iana_time_zone)) {
        throw new Error('Non Valid Time Zone provided')
    }

    try {
        var updatedRes = await prisma.hotel.update({
            where: {
                id: hotelId
            },
            data: {
                iana_time_zone
            }
        })

        return mapHotelResToHotel(updatedRes);
    } catch (error) {
        throw error;
    }
}



export function mapHotelResToHotel({
    id,
    hotel_name,
    maximun_free_calendar_days,
    minimal_prev_days_to_cancel,
    check_in_hour_time,
    check_out_hour_time,
    iana_time_zone,
}) {
    return {
        id,
        hotel_name,
        maximun_free_calendar_days,
        minimal_prev_days_to_cancel,
        check_in_hour_time: check_in_hour_time.toUTCString(),
        check_out_hour_time: check_out_hour_time.toUTCString(),
        iana_time_zone
    }
}