import {
    createHotel as createHotelDao,
    deleteHotelById as deleteHotelByIdDao,
    getHotels as getHotelsDao,
    updateHotelName as updateHotelNameDao,
    updateHotelCheckInTime as updateHotelCheckInTimeDao,
    updateHotelCheckOutTime as updateHotelCheckOutTimeDao,
    updateHotelFreeCalendarDays as updateHotelFreeCalendarDaysDao,
    updateHotelDaysToCancel as updateHotelDaysToCancelDao,
    getHotelById as getHotelByIdDao
} from "dao/HotelDao";
import { getAdminById } from "dao/UserDao";
import { isFullAdmin } from "dao/utils";

export async function createHotel({
    admin_id,
    hotel_name,
    maximun_free_calendar_days,
    check_in_hour_time,
    check_out_hour_time,
    minimal_prev_days_to_cancel
}) {

    // check for current userExecuting has autorization to 
    // create a new hotel, just FULL_ADMINS
    var admin = null;
    try {
        admin = await getAdminById(admin_id);
        // check authorization
        if (!isFullAdmin(admin.user_role)) {
            var error = new Error('UNAUTHORIZED');
            error.code = 'UNAUTHORIZED';
            throw error
        }

        // admin is full admin so lets create the hotel
        var hotel = await createHotelDao({
            hotel_name,
            maximun_free_calendar_days,
            check_in_hour_time,
            check_out_hour_time,
            minimal_prev_days_to_cancel
        })

        return hotel
    } catch (error) {
        throw error;
    }



}

export async function deleteHotelById(hotelId) {
    return deleteHotelByIdDao(hotelId)
}
export async function getHotels() {
    return getHotelsDao()
}
export async function updateHotelName(hotelId, hotelName) {
    return updateHotelNameDao(hotelId, hotelName)
}
export async function updateHotelCheckInTime(hotelId, check_in_hour_time) {
    return updateHotelCheckInTimeDao(hotelId, check_in_hour_time)
}
export async function updateHotelCheckOutTime(hotelId, check_out_hour_time) {
    return updateHotelCheckOutTimeDao(hotelId, check_out_hour_time)
}
export async function updateHotelFreeCalendarDays(hotelId, maximun_free_calendar_days) {
    return updateHotelFreeCalendarDaysDao(hotelId, maximun_free_calendar_days)
}
export async function updateHotelDaysToCancel(hotelId, minimal_prev_days_to_cancel) {
    return updateHotelDaysToCancelDao(hotelId, minimal_prev_days_to_cancel)
}

export async function getHotelById(hotelId) {
    return getHotelByIdDao(hotelId)
}