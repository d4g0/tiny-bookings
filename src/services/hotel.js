import { createHotel as createHotelDao } from "dao/HotelDao";
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