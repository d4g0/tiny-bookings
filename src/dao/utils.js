import { USER_ROLES } from "~/dao/DBConstans";

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
export function mapGetAdminByNameResToAdminUser({
    id, //  integer
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
        admin_name: admin_name,
        admin_description: admin_description,
        hash_password: hash_password,
        reset_token: reset_token,
        created_at: created_at
    }
}

/**
* Maps a `createFullAdminRes` to a Admin User Obj
* {
*  id: 7,
*  user_role: 1,
*  admin_name: 'test-full-admin',
*  admin_description: 'test admin for development',
*  hash_password: 'supper foo hash password ',
*  reset_token: 'supper reset token for test admin',
*  created_at: 2022-03-27T07:32:13.296Z
* }
* 
*/
export function mapCreateFullAdminResToAdminUser({
    id, // integer
    admin_name, // string,
    admin_description, //  string
    hash_password, //  string,
    reset_token, // string || null,
    created_at, // string
}) {


    return {
        id,
        user_role: USER_ROLES.FULL_ADMIN.user_role,
        admin_name,
        admin_description,
        hash_password,
        reset_token,
        created_at
    }
}