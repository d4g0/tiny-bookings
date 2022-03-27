import { prisma } from 'dao/PrismaClient.js'
import { isValidString } from 'utils'

/**
 * Retrives a user obj from db 
 * based in is user name, 
 * @param {String} username 
 */
export async function getAdminByName(adminName) {
    // validate
    if (!isValidString(adminName)) {
        throw new Error(`Non valid string provided: ${adminName}`)
    }

    // query for user with user_role
    var data = await prisma.admins.findFirst({
        where: {
            admin_name: adminName
        },
        include: {
            user_roles: true
        }
    })
    /**
    Query response data like
       {
            admin: {
                id: 1,
                user_role: 1,
                admin_name: 'dago',
                admin_description: 'system creator',
                hash_password: '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C',
                reset_token: null,
                created_at: 2022-03-26T05:02:30.090Z,
                user_roles: { id: 1, user_role: 'full-admin' }
            }
        }
     */
    // map to a user
    var admin = {
        id: data.id,
        user_role: data.user_roles.user_role,
        admin_name: data.admin_name,
        admin_description: data.admin_description,
        hash_password: data.hash_password,
        reset_token: data.reset_token,
        created_at: data.created_at
    }

    return admin;
}

export async function foo() {
    // return client.admins.
}