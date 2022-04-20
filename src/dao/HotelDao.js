import { prisma } from 'db/PrismaClient.js'
import { DB_UNIQUE_CONSTRAINT_ERROR, NOT_FOUND_RECORD_ERROR } from './Errors'
import { isValidHotelName, isValidHourTime, isValidId, isValidInteger, isValidTimeZone } from './utils'






/**
 * Creates a Hotel in DB
 * 
 * Throws dbErrors:
 * 
 */
export async function createHotel({
    hotel_name,
    maximun_free_calendar_days,
    check_in_hour_time, // hour_time { hour: 0 - 24 , min: 0 - 59 }
    check_out_hour_time,
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

    if (!isValidHourTime(check_in_hour_time)) {
        throw new Error(`Non valid check_in_hour_time provided`)
    }

    if (!isValidHourTime(check_out_hour_time)) {
        throw new Error(`Non valid check_in_hour_time provided`)
    }

    if (!isValidInteger(minimal_prev_days_to_cancel)) {
        throw new Error(`Non valid minimal_prev_days_to_cancel integer provided: ${minimal_prev_days_to_cancel}`)
    }

    if (!isValidTimeZone(iana_time_zone)) {
        throw new Error('Non Valid Time Zone provided')
    }



    try {
        // create
        var hotel = await prisma.hotel.create({
            data: {
                hotel_name,
                maximun_free_calendar_days,
                minimal_prev_days_to_cancel,
                check_in_hour_time,
                check_out_hour_time,
                iana_time_zone
            }
        })

        return mapHotelResToHotel(hotel);

    } catch (error) {
        // handle know errors
        // unique constraint
        if (error?.code == 'P2002') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Unable to create as unique constrain fails')
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
        var hotel = await prisma.hotel.findFirst({
            where: {
                id: hotelId
            },
        })
        if (!hotel) {
            throw new NOT_FOUND_RECORD_ERROR('No Hotel Found')
        }
        return mapHotelResToHotel(hotel);
    } catch (error) {
        throw error
    }
}

export async function deleteHotelById(hotelId) {
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }

    try {
        var delHotel = await prisma.hotel.delete({
            where: {
                id: hotelId
            }
        })
        return mapHotelResToHotel(delHotel);
    } catch (error) {
        if (error?.code == 'P2025') {
            error = new NOT_FOUND_RECORD_ERROR('Not Found')
        }
        throw error
    }
}

export async function getHotels() {
    var hotelsRaw = await prisma.hotel.findMany();
    var hotels = hotelsRaw.map(hotel => mapHotelResToHotel(hotel));
    return hotels;
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