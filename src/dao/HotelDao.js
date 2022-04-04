import { prisma } from 'dao/PrismaClient.js'
import { isValidString } from 'utils'

import { DB_UNIQUE_CONSTRAINT_ERROR, NOT_FOUND_RECORD_ERROR } from './Errors'
import { isValidHotelName, isValidHourTime, isValidId, isValidInteger } from './utils'






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



    try {
        // create
        var hotelRes = await prisma.hotel.create({
            data: {
                hotel_name,
                maximun_free_calendar_days,
                minimal_prev_days_to_cancel,
                check_in_hour_time,
                check_out_hour_time,
            }
        })

        return hotelRes;

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


export async function deleteHotelById(hotelId) {
    if (!isValidId(hotelId)) {
        throw new Error('Non Valid Hotel Id');
    }

    try {
        var delRes = await prisma.hotel.delete({
            where: {
                id: hotelId
            }
        })
        return delRes;
    } catch (error) {

    }
}

export async function getHotels() {
    return prisma.hotel.findMany();
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

        return updatedRes;
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

        return updatedRes;
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

        return updatedRes;
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

        return updatedRes;
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

        return updatedRes;
    } catch (error) {
        throw error;
    }
}

