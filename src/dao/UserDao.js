import { prisma } from 'dao/PrismaClient.js'
import { isValidString } from 'utils'
import { mapCreateFullAdminResToAdminUser, mapAdminResponseDataToAdminUser } from '~/dao/utils'
import { USER_ROLES } from './DBConstans'




/**
 * User Dao Errors
 */
export const USER_DAO_ERRORS = {
    // used for a not-found custom error
    // that was refactored
    // but im goin to leave the object here
    // in case that later can be needed ok
}

/**
 * Retrives an admin user  from db 
 * based in is user name since it's a 
 * `UNIQUE` constrained field
 * 
 * Throws dbErrors:
 * 
 * If admin does not exists returns `null`
 * 
 * 
 * 
 * @param {String} username 
 */
export async function getAdminByEmail(adminEmail) {
    // validate
    if (!isValidString(adminEmail)) {
        throw new Error(`Non valid string provided: ${adminName}`)
    }

    // query for user with user_role
    var data = await prisma.admins.findUnique({
        where: {
            email: adminEmail
        },
        include: {
            user_roles: true
        },
    })


    // handle not found case
    if (!data) {
        
        return null;
    }

    // handle found case

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
    // --------------------
    // MAP to a admin user 
    // --------------------
    var admin = mapAdminResponseDataToAdminUser({
        id: data.id,
        user_roles: data.user_roles,
        email: data.email,
        admin_name: data.admin_name,
        admin_description: data.admin_description,
        hash_password: data.hash_password,
        reset_token: data.reset_token,
        created_at: data.created_at
    })


    return admin;
}

/**
 * 
 * Creates a Full-Admin in the db
 * Throws db errors or bad args errors
 * Atemp to create an admin with a name allready present
 * throws an error containing 
 * ```js
 * {
 *  code: 'P2002',
 * }
 * ```
 * @param {Object} admin_data
 */
export async function createFullAdmin({
    email,
    admin_name,
    admin_description,
    hash_password,
    reset_token = null,
}) {
    // validate args
    if (!isValidString(admin_name)) {
        throw new Error(`Non Valid String admin_name arg value: ${admin_name}`)
    }
    if (!isValidString(admin_description)) {
        throw new Error(`Non Valid String admin_description arg value: ${admin_description}`)
    }
    // Investigate if `isValidString` is adecuate validation mecanism for bcrypt hashes
    if (!isValidString(email)) {
        throw new Error(`Non Valid String admin_description arg value: ${hash_password}`)
    }
    // Investigate if `isValidString` is adecuate validation mecanism for bcrypt hashes
    if (!isValidString(hash_password)) {
        throw new Error(`Non Valid String admin_description arg value: ${hash_password}`)
    }

    // map correct user role id (based in the db constants as is db dependent)
    var full_admin_role_id = USER_ROLES.FULL_ADMIN.id;
    // validate reset_token or set null default since it's optional
    var computed_rest_token = isValidString(reset_token) ? reset_token : null;


    // query the admin creation
    var res = await prisma.admins.create({
        data: {
            user_role: full_admin_role_id,
            email,
            admin_name,
            admin_description,
            hash_password,
            reset_token: computed_rest_token,
        }
    })

    /**
     * Response expected to be like
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
    var admin = mapCreateFullAdminResToAdminUser({
        id: res.id,
        email:res.email,
        admin_name: res.admin_name,
        admin_description: res.admin_description,
        hash_password: res.hash_password,
        reset_token: res.reset_token,
        created_at: res.created_at
    })

    return admin;
}


/**
 * Deletes a admin user from db
 * filtered by his name
 * @param {String} adminName 
 */
export async function deleteAdminByEmail(adminEmail) {
    // validate
    if (!isValidString(adminEmail)) {
        throw new Error(`Non valid string provided: ${adminEmail}`)
    }

    var delRes = await prisma.admins.delete({
        where: {
            email: adminEmail
        },
        include:{
            user_roles:true
        }
    })

    var deletedUser = mapAdminResponseDataToAdminUser({
        id: delRes.id,
        email:delRes.email,
        admin_name: delRes.admin_name,
        admin_description: delRes.admin_description,
        hash_password: delRes.hash_password,
        reset_token: delRes.reset_token,
        created_at: delRes.created_at,
        user_roles:delRes.user_roles
    })



    return deletedUser;
}