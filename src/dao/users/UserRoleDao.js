import { prisma } from "~/dao/PrismaClient";
import { isValidUserRoleKey } from "dao/utils";


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

export async function getUserRoleByKey(user_role_key) {

}

export async function getUserRoleById(user_role_id) {

}
