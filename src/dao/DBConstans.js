// This constans shoul be fullfiled in the data-base, 
// in the precise same order as in the `init-db-values.sql` file
// TODO
// Dprecate the use of the `id` field

import { isValidId } from "./utils";

// will be dinamyc as is db state dependent
export const USER_ROLES = {
    'FULL_ADMIN': {
        id: 1,
        user_role: 'FULL_ADMIN'
    },
    'BASIC_ADMIN': {
        id: 2,
        user_role: 'BASIC_ADMIN'
    },
    'CLIENT': {
        id: 3,
        user_role: 'CLIENT'
    }
}

export function setUserRoleId(user_role_key, id) {
    if (!isValidId(id)) {
        throw new error(`Non valid id: ${id}`);
    }
    if (!USER_ROLES[user_role_key]) {
        throw new error(`Non valid user_role_key: ${user_role_key}`);
    }

    USER_ROLES[user_role_key].id = id;
}

/**
 * Returns the current id of the local user role
 * constant. Throws if passed a bad `user_role_key`
 * @param {String} user_role_key 
 * @returns {number} 
 */
export function getUserRoleId(user_role_key) {
    if (!USER_ROLES[user_role_key]) {
        throw new error(`Non valid user_role_key: ${user_role_key}`);
    }
    return USER_ROLES[user_role_key].id
}

export const USER_ROLES_LIST = [
    USER_ROLES.FULL_ADMIN,
    USER_ROLES.BASIC_ADMIN,
    USER_ROLES.CLIENT
]
