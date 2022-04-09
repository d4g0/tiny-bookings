import { prisma } from "~/dao/PrismaClient";
import { isValidUserRoleKey } from "dao/utils";

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
