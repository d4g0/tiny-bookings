import { prisma } from "db/PrismaClient";
import { isValidUserRoleKey } from "dao/utils";
import { setUserRoleId, USER_ROLES } from "dao/DBConstans";
import sql from "db/postgres";

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
 * And set it's ids to match the ones in the db to avoid
 * inesesary hits to db since this values should never change
 */
export async function initUserRoles() {
    try {



        // full admin
        var fullAdmin = await getUserRoleByKey(USER_ROLES.FULL_ADMIN.user_role);
        // create if not found
        if (!fullAdmin) {
            fullAdmin = await createUserRole(USER_ROLES.FULL_ADMIN.user_role);
        }
        // set id
        setUserRoleId(fullAdmin.user_role, fullAdmin.id);

        // basic admin
        var basicAdmin = await getUserRoleByKey(USER_ROLES.BASIC_ADMIN.user_role);
        // create if not found
        if (!basicAdmin) {
            basicAdmin = await createUserRole(USER_ROLES.BASIC_ADMIN.user_role);
        }
        // set id
        setUserRoleId(basicAdmin.user_role, basicAdmin.id);

        // client
        var client = await getUserRoleByKey(USER_ROLES.CLIENT.user_role);
        // create if not found
        if (!client) {
            client = await createUserRole(USER_ROLES.CLIENT.user_role);
        }
        // set id
        setUserRoleId(client.user_role, client.id);



    } catch (error) {
        throw error
    }
}

/**
 * Fetch an returns the user roles from db
 */
export async function getUserRoles(){
    try {
        const user_roles = await sql`
            select * from user_roles;
        `
        return user_roles;
    } catch (error) {
        throw error;
    }
}