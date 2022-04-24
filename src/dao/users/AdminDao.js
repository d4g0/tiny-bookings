import sql from 'db/postgres'
import { isValidString } from 'utils'
import { isValidEmail, isValidId } from '~/dao/utils'
import { DB_UNIQUE_CONSTRAINT_ERROR, DB_UNIQUE_CONSTRAINT_ERROR_KEY, NOT_FOUND_RECORD_ERROR } from '../Errors'


/**
 * 
 * Creates a Admin in the db
 * Throws db errors or bad args errors
 * Atemp to create an admin with a name allready present
 * throws an error containing 
 * ```js
 * {
 *  code: 'P2002', TODO define this error
 * }
 * ```
 */
export async function createAdmin({
    user_role_id,
    email,
    admin_name,
    admin_description,
    hash_password,
}) {

    if (!isValidId(user_role_id)) {
        throw new Error(`Non Valid String user_role arg value: ${user_role_id}`)
    }

    if (!isValidString(admin_name)) {
        throw new Error(`Non Valid String admin_name arg value: ${admin_name}`)
    }
    if (!isValidString(admin_description)) {
        throw new Error(`Non Valid String admin_description arg value: ${admin_description}`)
    }
    // Investigate if `isValidString` is adecuate validation mecanism for bcrypt hashes
    if (!isValidString(email)) {
        throw new Error(`Non Valid String email arg value: ${email}`)
    }
    if (!isValidString(hash_password)) {
        throw new Error(`Non Valid String hash_password arg value: ${hash_password}`)
    }



    try {
        var adminRes = await sql`
        with i_adm as 
        ( 
            insert into 
                admins (
                    user_role,
                    admin_name,
                    admin_description,
                    email,
                    hash_password
                ) 
            values (
                ${user_role_id},
                ${admin_name},
                ${admin_description},
                ${email},
                ${hash_password}
            ) RETURNING
                admins.id,
                admins.user_role,
                admins.admin_name, 
                admins.admin_description,
                admins.email,
                admins.hash_password,
                admins.reset_token,
                admins.created_at
        ) 
        select 
                i_adm.id,
                ur.user_role,
                i_adm.admin_name, 
                i_adm.admin_description,
                i_adm.email,
                i_adm.hash_password,
                i_adm.reset_token,
                i_adm.created_at
        from i_adm join user_roles ur on (i_adm.user_role = ur.id )
        ;
        `

        var admin = adminRes[0];

        return admin;
    } catch (error) {
        // duplicated key postgres error
        if (error?.code == '23505') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Duplicated Admin name or description')
        }
        throw error;
    }



}


/**
 * Retrives an admin user  from db 
 * based in is email since it's a 
 * `UNIQUE` constrained field
 * If admin does not exists returns `null`
 * @param {String} adminEmail 
 */
export async function getAdminByEmail(adminEmail) {
    // validate
    if (!isValidString(adminEmail)) {
        throw new Error(`Non valid string provided: ${adminName}`)
    }
    try {


        // query for user with user_role
        var adminRes = await sql`
        select 
            adm.id,
            ur.user_role,
            adm.admin_name, 
            adm.admin_description,
            adm.email,
            adm.hash_password,
            adm.reset_token,
            adm.created_at
        from admins adm join user_roles ur on (adm.user_role = ur.id )
        where adm.email = ${adminEmail}
        ;
        `
        var admin = adminRes.length > 0 ? adminRes[0] : null

        return admin;
    }
    catch (error) {
        throw error
    }
}


export async function getAdminByEmail_NO_THROW(email) {
    if (!isValidEmail(email)) {
        throw new Error('Non valid email')
    }

    try {

        var adminRes = await sql`
        select 
            adm.id,
            ur.user_role,
            adm.user_role,
            adm.admin_name,
            adm.admin_description,
            adm.hash_password,
            adm.reset_token,
            adm.created_at,
            adm.email
        from admins adm 
        join user_roles ur on( adm.user_role = ur.id)
        where adm.email = ${email};
        `;

        var admin = adminRes.length > 0 ? adminRes[0] : null;
        return admin;

    } catch (error) {
        throw error;
    }
}

/**
 * Retrives an admin user  from db 
 * based in is user id since it's a 
 * `UNIQUE` constrained field (PK)
 * If admin does not exists returns `null`
 * @param {String} adminId 
 */
export async function getAdminById(adminId) {
    // validate
    if (!isValidId(adminId)) {
        throw new Error(`Non valid $adminId provided: ${adminId}`)
    }

    // query for user with user_role
    var adminRes = await sql`
     select 
         adm.id,
         ur.user_role,
         adm.admin_name, 
         adm.admin_description,
         adm.email,
         adm.hash_password,
         adm.reset_token,
         adm.created_at
     from admins adm join user_roles ur on (adm.user_role = ur.id )
     where adm.id = ${adminId}
     ;
     `
    var admin = adminRes.length > 0 ? adminRes[0] : null

    return admin;
}



/**
 * Deletes a admin user from db
 * filtered by his email
 * @param {String} adminEmail 
 */
export async function deleteAdminByEmail(adminEmail) {
    // validate
    if (!isValidString(adminEmail)) {
        throw new Error(`Non valid $adminEmail provided: ${adminEmail}`)
    }

    try {
        var delRes = await sql`
        delete from admins adm where adm.email = ${adminEmail} returning *;
        `;

        var count = delRes.length;
        var completed = true;

        return {
            count,
            completed
        }
    } catch (error) {
        throw error;
    }

}

/**
 * Deletes a admin user from db
 * filtered by his name
 * @param {number} id 
 */
export async function deleteAdminById(id) {
    // validate
    if (!isValidId(id)) {
        throw new Error(`Non valid $id provided: ${id}`)
    }

    try {
        var delRes = await sql`
        delete from admins adm where adm.id = ${id} returning *;
        `;

        var count = delRes.length;
        var completed = true;

        return {
            count,
            completed
        }
    } catch (error) {
        throw error;
    }

}


export async function getAdmins() {
    try {
        var admRes = await sql`
        select 
            adm.id,
            ur.user_role,
            adm.admin_name, 
            adm.admin_description,
            adm.email,
            adm.hash_password,
            adm.reset_token,
            adm.created_at
        from admins adm join user_roles ur on (adm.user_role = ur.id )
        `;

        return admRes;
    } catch (error) {
        throw error;
    }
}
