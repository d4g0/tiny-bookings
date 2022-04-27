import { isValidString } from "utils";
import { USER_ROLES } from "~/dao/DBConstans";
import Joi from 'joi';
import moment from 'moment-timezone';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
/**
 * Maps a find admin query response data 
 * to a consumable admin user obj
 * 
 * Data obj expected as:
 * ```js
 *  {
 *      id: 1,
 *      user_role: 1,
 *      admin_name: 'dago',
 *      admin_description: 'system creator',
 *      hash_password: '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C',
 *      reset_token: null,
 *      created_at: 2022-03-26T05:02:30.090Z,
 *      user_roles: { id: 1, user_role: 'full-admin' }
 *  }
 * ```
 * 
*/


export function isInAdminRoles(user_role) {
    var isInAdminRoles = false;
    if (!isValidString(user_role)) {
        return isInAdminRoles
    }
    const admin_roles_list = [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role];
    const user_role_index = admin_roles_list.indexOf(user_role);
    if (user_role_index == -1) {
        return isInAdminRoles
    }
    isInAdminRoles = true;
    return isInAdminRoles;

}

export function isFullAdmin(user_role) {
    var isFullAdmin = false;
    if (!isValidString(user_role)) {
        return isInAdminRoles
    }
    isFullAdmin = user_role == USER_ROLES.FULL_ADMIN.user_role;
    return isFullAdmin;

}

// ---------------
// VAlidators 
// ---------------


export function isValidEmail(email) {
    const emailSchema = Joi.string().email().required();
    const { error, value } = emailSchema.validate(
        email,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidUserName(user_name) {
    const userNameSchema = Joi.string().min(4).max(60).required();
    const { error, value } = userNameSchema.validate(
        user_name,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidClientName(user_name) {
    const userNameSchema = Joi.string().min(1).max(60).required();
    const { error, value } = userNameSchema.validate(
        user_name,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidAdminDescription(admin_description) {
    const adminDescriptionSchema = Joi.string().min(4).max(150).required();
    const { error, value } = adminDescriptionSchema.validate(
        admin_description,
        { presence: 'required', convert: false }
    );
    return !error;
}


/**
 * A valid password is a string
 * From 8 characters to 24
 * @param {string} password 
 * @returns 
 */
export function isValidPassword(password) {
    // a password should have to be at least 8 chars long
    // maximun 18 charactes
    const passwordSchema = Joi.string().min(8).max(24).required();
    const { error, value } = passwordSchema.validate(
        password,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidId(id) {
    const idSchema = Joi.number().integer().min(0).required();
    const { error, value } = idSchema.validate(
        id,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidInteger(number) {
    const intSchema = Joi.number().integer().required();
    const { error, value } = intSchema.validate(
        number,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidPositiveInteger(number) {
    const intSchema = Joi.number().integer().required().min(0);
    const { error, value } = intSchema.validate(
        number,
        { presence: 'required', convert: false }
    );
    return !error;
}

/**
 * A valid Hotel Name is a string
 * From 4 characters to 60
 * @param {string} password 
 * @returns 
 */
export function isValidHotelName(hotelName) {
    // a password should have to be at least 8 chars long
    // maximun 18 charactes
    const hotelNameSchema = Joi.string().trim().min(4).max(60).required();
    const { error, value } = hotelNameSchema.validate(
        hotelName,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidHourTime({ hours = 0, mins = 0 }) {
    // hours from 0 to 23 and min from 0 to 59
    // to avoid date recalculations
    const hourSchema = Joi.number().integer().min(0).max(23).required();
    const minSchema = Joi.number().integer().min(0).max(59).required();

    const { h_error, h_value } = hourSchema.validate(
        hours,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = minSchema.validate(
        mins,
        { presence: 'required', convert: false }
    );


    return !h_error && !m_error;
}

export function isValidHourTime2({ hour = 0, minute = 0 }) {
    // hours from 0 to 23 and min from 0 to 59
    // to avoid date recalculations
    const hourSchema = Joi.number().integer().min(0).max(23).required();
    const minSchema = Joi.number().integer().min(0).max(59).required();

    const { h_error, h_value } = hourSchema.validate(
        hour,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = minSchema.validate(
        minute,
        { presence: 'required', convert: false }
    );


    return !h_error && !m_error;
}

export function isValidHourTimeInput(hourTime = { hours: 0, minutes: 0 }) {
    // hours from 0 to 23 and min from 0 to 59
    // to avoid date recalculations

    if (Number.isNaN(Number.parseInt(hourTime.hours))){
        return false;
    }
    if (Number.isNaN(Number.parseInt(hourTime.minutes))){
        return false;
    }

    const hourSchema = Joi.number().integer().min(0).max(23).required();
    const minSchema = Joi.number().integer().min(0).max(59).required();

    const { h_error, h_value } = hourSchema.validate(
        hourTime.hours,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = minSchema.validate(
        hourTime.minutes,
        { presence: 'required', convert: false }
    );



    return !h_error && !m_error;
}

export function isValidTimeZone(iana_time_zone) {
    var tzSchema = Joi.string().trim().required();
    const { error, value } = tzSchema.validate(
        iana_time_zone,
        { presence: 'required', convert: false }
    );

    return !error;
}



export function isValidRoomType(roomType) {
    var roomSchema = Joi.string().trim().min(4).max(30);
    var { error, value } = roomSchema.validate(
        roomType,
        { presence: 'required', convert: false }
    )
    return !error;
}


export function isValidRoomAmenity(amenity) {
    var amenitySchema = Joi.string().trim().min(1).max(30);
    var { error, value } = amenitySchema.validate(
        amenity,
        { presence: 'required', convert: false }
    )
    return !error;
}


export function isValidRoomName(room_name) {
    var roomNameSchema = Joi.string().trim().min(4).max(20);
    var { error, value } = roomNameSchema.validate(
        room_name,
        { presence: 'required', convert: false }
    )
    return !error;
}

export function areValidAmenities(amenities = []) {
    if (!Array.isArray(amenities)) {
        return false
    }
    if (!amenities.length) {
        return false
    }

    var areValidAmenities = true;

    for (let i = 0; i < amenities.length; i++) {
        if (!isValidRoomAmenity(amenities[i])) {
            areValidAmenities = false;
            break;
        }

    }
    return areValidAmenities;
}

export function areValidAmenitiesIds(ids = []) {
    if (!Array.isArray(ids)) {
        return false
    }
    if (!ids.length) {
        // empty amenities array case
        return true
    }

    var areValidIds = true;

    for (let i = 0; i < ids.length; i++) {
        if (!isValidId(ids[i])) {
            areValidIds = false;
            break;
        }

    }
    return areValidIds;
}

export function isValidPrice(price) {
    const priceSchema = Joi.number().required().min(0.1);
    const { error, value } = priceSchema.validate(
        price,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidUserRoleKey(user_role_key) {
    var userRoleSchema = Joi.string().required().trim().min(3).max(40);
    const { error, value } = userRoleSchema.validate(
        user_role_key,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidRoomLockReason(reason) {
    var reasonSchema = Joi.string().required().trim().min(5).max(300);
    const { error, value } = reasonSchema.validate(
        reason,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidYearMonthDayDate(yearMonthDayDate = { year, month, day }) {
    var yearSchema = Joi.number().integer().min(2000).max(3000);
    var monthSchema = Joi.number().integer().min(0).max(11);
    var daySchema = Joi.number().integer().min(1).max(31);
    var complyAllSchemas;

    const { y_error, y_value } = yearSchema.validate(
        yearMonthDayDate.year,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = monthSchema.validate(
        yearMonthDayDate.month,
        { presence: 'required', convert: false }
    );
    const { d_error, d_value } = daySchema.validate(
        yearMonthDayDate.day,
        { presence: 'required', convert: false }
    );
    complyAllSchemas = !y_error && !m_error && !d_error;

    return complyAllSchemas;
}

export function isValidIanaTimeZone(timeZone) {
    var isValidTimeZone;
    if (typeof timeZone != 'string') {
        isValidTimeZone = false
        return isValidTimeZone
    }
    var tz = moment.tz.names();
    isValidTimeZone = tz.includes(timeZone);
    return isValidTimeZone;
}

export function isValidDateObject(date) {
    return typeof date?.getMonth == 'function'
}


export function isValidDateInput(dInput = { year, month, day, hour, minute }) {
    var yearSchema = Joi.number().integer().min(2000).max(3000);
    var monthSchema = Joi.number().integer().min(0).max(11);
    var daySchema = Joi.number().integer().min(1).max(31);
    var hourSchema = Joi.number().integer().min(0).max(23);
    var minSchema = Joi.number().integer().min(0).max(59);
    var complyAllSchemas;

    const { y_error, y_value } = yearSchema.validate(
        dInput.year,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = monthSchema.validate(
        dInput.month,
        { presence: 'required', convert: false }
    );
    const { d_error, d_value } = daySchema.validate(
        dInput.day,
        { presence: 'required', convert: false }
    );
    const { h_error, h_value } = hourSchema.validate(
        dInput.hour,
        { presence: 'required', convert: false }
    );
    const { mi_error, mi_value } = minSchema.validate(
        dInput.min,
        { presence: 'required', convert: false }
    );

    complyAllSchemas = !y_error && !m_error && !d_error && !m_error && !d_error && !h_error && !m_error;
    return complyAllSchemas;
}


export function isValidBookingState(booking_state) {
    var stateSchema = Joi.string().required().trim().min(2).max(40);
    const { error, value } = stateSchema.validate(
        booking_state,
        { presence: 'required', convert: false }
    );
    return !error;
}


export function isValidPaymentType(payment_type) {
    var paymentSchema = Joi.string().required().trim().min(2).max(60);
    const { error, value } = paymentSchema.validate(
        payment_type,
        { presence: 'required', convert: false }
    );
    return !error;
}


export function isValidCurrnecy(currency_key) {
    var currnecySchema = Joi.string().required().trim().min(2).max(10);
    const { error, value } = currnecySchema.validate(
        currency_key,
        { presence: 'required', convert: false }
    );
    return !error;
}

// ---------------
// Mapers 
// ---------------

/**
 * 
 * Maps a `time` obj to a Default Date with the `hour-time`
 * sets as the time obj
 * @returns 
 */
export function mapTimeToDateTime({ hours, mins }) {
    var now = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
    now.setUTCHours(hours, mins, 0);
    return now;
}

export function mapYearMonthDayDateToUTC({ year = 1970, month = 0, day = 1 }) {
    var utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    return utcDate;
}

export function setUTCHourTime({ date, hour, minute }) {
    date.setUTCHours(hour, minute, 0, 0);
    return date;
}

export function utcDate({
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
}) {
    return new Date(Date.UTC(
        year, month, day, hour, minute
    ));
}

export function getCurrentUTCDayDate() {
    var dt = DateTime.now();
    var dayDate = utcDate({
        year: dt.year,
        month: dt.month,
        day: dt.day
    })

    return dayDate;
}

/**
 * Extracs the hour and minute from a 
 * Date obj and return it as `{ hour, minute}`
 * @param {Date} date 
 * @returns 
 */
export function mapDateToHourTime(date) {

    if (typeof date.getUTCHours != 'function') {
        throw Error('Non Valid date object');
    }

    var hour = date.getUTCHours();
    var minute = date.getUTCMinutes();

    return { hour, minute }
}

export function randStr(size = 4) {
    return uuid().substring(0, size)
}


export function hourTimeToSQLTimeStr({ hours, minutes }) {
    var time = {
        hours, minutes
    }

    // hour
    if (hours < 10) {
        time.hours = `0${hours}`
    } else {
        time.hours = `${hours}`
    }

    // minutes
    if (minutes < 10) {
        time.minutes = `0${minutes}`
    } else {
        time.minutes = `${minutes}`
    }


    return `${time.hours}:${time.minutes}`

}