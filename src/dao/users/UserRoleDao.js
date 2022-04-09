import { prisma } from "~/dao/PrismaClient";
import { isValidUserRoleKey } from "dao/utils";
import { USER_ROLES } from "dao/DBConstans";

/**
 * Create a `user_role` record in the db 
 * and returns it
 * @param {String} user_role_key 
 * @returns {{ id: number, user_role: String}}
 */
export async function createUserRole(user_role_key) {
    if (!isValidUserRoleKey(user_role_key)) {
        throw new Error(`Non valid user role key: ${user_role_key}`)
    }

    try {

        var userRole = await prisma.user_roles.create({
            data: {
                user_role: user_role_key
            }
        });

        return userRole;
    } catch (error) {
        throw error;
    }
}

/**
 * Attemp to retrieve a `user_role` record in the db 
 * and returns it, returns `null` if record does not exists
 * @param {String} user_role_key 
 * @returns {{ id: number, user_role: String}}
 */
export async function getUserRoleByKey(user_role_key) {
    if (!isValidUserRoleKey(user_role_key)) {
        throw new Error(`Non valid user role key: ${user_role_key}`)
    }

    try {

        var userRole = await prisma.user_roles.findUnique({
            where: {
                user_role: user_role_key
            }
        });

        return userRole;
    } catch (error) {
        throw error;
    }
}

/**
 * Attemp to delete a `user_role` record in the db 
 * throws a prisma `P2025` error if record does not exists
 * @param {String} user_role_key 
 * @returns {{ id: number, user_role: String}}
 */
export async function deleteUserRole(user_role_key) {
    if (!isValidUserRoleKey(user_role_key)) {
        throw new Error(`Non valid user role key: ${user_role_key}`)
    }

    try {

        var userRole = await prisma.user_roles.delete({
            where: {
                user_role: user_role_key
            }
        });

        return userRole;
    } catch (error) {
        throw error;
    }
}

/**
 * As User Roles should behave like enums in the db
 * they should be properly initialiced
 * this functions does exactly that.
 * Create a FULL_ADMIN, BASIC_ADMIN, CLIENT
 * user roles in that order, to match the `DBConstanst`
 * Throws if it can't do it.
 */
export async function initUserRoles() {
    try {



        // full admin
        var fullAdmin = await getUserRoleByKey(USER_ROLES.FULL_ADMIN.user_role);
        // create if not found
        if (!fullAdmin) {
            fullAdmin = await createUserRole(USER_ROLES.FULL_ADMIN.user_role);
        }
        // TODO
        // Valorating eliminaiting the match ids test since 
        // it's potentially dangerous for production dbs
        // commented out for the moment 
        // check id match constans
        // if (fullAdmin.id != USER_ROLES.FULL_ADMIN.id) {
        //     throw new Error(`(init:user_roles) Admin has a non establish id: expecting ${USER_ROLES.FULL_ADMIN.id}, recived ${fullAdmin.id}`)
        // }

        // basic admin
        var basicAdmin = await getUserRoleByKey(USER_ROLES.BASIC_ADMIN.user_role);
        // create if not found
        if (!basicAdmin) {
            basicAdmin = await createUserRole(USER_ROLES.BASIC_ADMIN.user_role);
        }
        // check id match constans
        // if (basicAdmin.id != USER_ROLES.BASIC_ADMIN.id) {
        //     throw new Error(`(init:user_roles) Admin has a non stablish id: expecting ${USER_ROLES.BASIC_ADMIN.id}, recived ${basicAdmin.id}`)
        // }

        // client
        var client = await getUserRoleByKey(USER_ROLES.CLIENT.user_role);
        // create if not found
        if (!client) {
            client = await createUserRole(USER_ROLES.CLIENT.user_role);
        }
        // check id match constans
        // if (client.id != USER_ROLES.CLIENT.id) {
        //     throw new Error(`(init:user_roles) Admin has a non stablish id: expecting ${USER_ROLES.CLIENT.id}, recived ${client.id}`)
        // }

    } catch (error) {
        throw error
    }
}