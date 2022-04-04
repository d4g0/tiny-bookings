import { isValidString } from "utils";
import { USER_ROLES } from "~/dao/DBConstans";
import Joi from 'joi';

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
export function mapAdminResponseDataToAdminUser({ // rename
    id, //  integer
    email, // string
    admin_name, // string
    admin_description, // string
    hash_password, // string
    reset_token,  // string || null
    created_at,  // string
    user_roles, // object like { id: 0, user_role: '' } (user_role record from the join)
}) {
    return {
        id: id,
        // map user_role `id` to user_role `string` in the join `user_roles` table
        user_role: user_roles.user_role,
        email, // string
        admin_name,
        admin_description,
        hash_password,
        reset_token,
        created_at: new Date(created_at).toISOString()
    }
}

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

export function isValidEmail(email) {
    const emailSchema = Joi.string().email();
    const { error, value } = emailSchema.validate(email);
    return !error;
}

export function isValidUserName(user_name) {
    const userNameSchema = Joi.string().min(4).max(60);
    const { error, value } = userNameSchema.validate(user_name);
    return !error;
}

export function isValidAdminDescription(admin_description) {
    const adminDescriptionSchema = Joi.string().min(4).max(150);
    const { error, value } = adminDescriptionSchema.validate(admin_description);
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
    const passwordSchema = Joi.string().min(8).max(24);
    const { error, value } = passwordSchema.validate(password);
    return !error;
}

export function isValidId(creator_admin_id) {
    const idSchema = Joi.number().integer();
    const { error, value } = idSchema.validate(creator_admin_id);
    return !error;
}

export function isValidInteger(number) {
    const intSchema = Joi.number().integer();
    const { error, value } = intSchema.validate(number);
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
    const hotelNameSchema = Joi.string().trim().min(4).max(60);
    const { error, value } = hotelNameSchema.validate(hotelName);
    return !error;
}

export function isValidHourTime({ hours = 0, mins = 0 }) {
    // hours from 0 to 23 and min from 0 to 59
    // to avoid date recalculations
    const hourSchema = Joi.number().integer().min(0).max(23);
    const minSchema = Joi.number().integer().min(0).max(59);

    const { h_error, h_value } = hourSchema.validate(hours);
    const { m_error, m_value } = minSchema.validate(mins);


    return !h_error && !m_error;
}

/**
 * 
 * Maps a `time` obj to a Default Date with the `hour-time`
 * sets as the time obj
 * @returns 
 */
export function mapTimeToDateTime({ hours, mins }) {
    var now = new Date(Date.UTC(2020, 0, 1, 0, 0, 0));
    now.setUTCHours(hours, mins, 0);
    return now;
}