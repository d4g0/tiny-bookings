import { USER_ROLES } from "dao/DBConstans";
import { getAdminById, getAdminByEmail, getAdmins } from "dao/users/AdminDao";
import { createAdmin, deleteAdminById as delAdminByIdDao } from 'dao/users/AdminDao'
import {
    isValidEmail,
    isValidUserName,
    isValidAdminDescription,
    isValidPassword,
    isValidId,
} from "dao/utils";
import bcrypt from "bcryptjs";
import { NOT_FOUND_RECORD_ERROR, VALIATION_ERROR } from "dao/Errors";


/**
 * 
 * Creates and admin
 * Available for `FULL_ADMIN` role only
 */
export async function createAdminService({
    creator_admin_id,
    user_role_id,
    email,
    admin_name,
    admin_description,
    password,
    reset_token, // reset token for admin users are defered for now
}) {
    // validate args
    // check if creator_admin is a FULL_ADMIN since 
    // just that role should be able to create new admins
    // hash password
    // save to db
    // return the saved admin obj 

    // validate creator_admin_id
    if (!isValidId(creator_admin_id)) {
        throw new Error(`$creator_admin_id argument dosen't match with the real records : creator_admin_id: ${creator_admin_id}`);
    }
    // user role validation
    if (!isValidId(user_role_id)) {
        throw new Error(`Non valid user_role_id`);
    }

    // email validation
    if (!isValidEmail(email)) {
        throw new Error(`$email arg is not a valid email: ${email}`);
    }

    // admin name validation
    if (!isValidUserName(admin_name)) {
        throw new Error(`$admin_name arg is not a valid admin_name: ${admin_name}`);
    }

    // admin_description validation
    if (!isValidAdminDescription(admin_description)) {
        throw new Error(`$admin_description arg is not a valid admin_description: ${admin_description}`);
    }

    // password validation
    if (!isValidPassword(password)) {
        throw new Error(`$password arg is not a valid password: ${'not-loged for privacy'}`);
    }

    // reset token defered for admins user for now

    // ok by now every argument it's valid
    // check if corresponding creator admin exists and it's full admin
    try {
        var admin = getAdminById(creator_admin_id);
        // case admin not found
        if (!admin) {
            throw new Error(`Creator Admin with id: ${creator_admin_id} does not exists`)
        }
        // case admin is not full admin
        if (!admin?.user_role == USER_ROLES.FULL_ADMIN.key) {
            throw new Error(`Creator Admin with id: ${creator_admin_id} does not have authorization to create a new admin`)
        }

    } catch (error) {
        throw error
    }
    // ok by now the admin creator is a full 
    // admin lets finally create that new admin

    // lets hash that password
    const hash = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(password, hash);

    // save admin to db
    try {
        const createdAdmin = await createAdmin({
            user_role_id,
            email,
            admin_name,
            admin_description,
            hash_password: hashed_password,
        })

        return createdAdmin;

    } catch (error) {
        // check for know errors
        throw error
    }

}


export async function getAdminByEmailService(adminEmail) {
    return getAdminByEmail(adminEmail)
}





export async function getAdminsService() {
    return getAdmins();
}

export async function deleteAdminById(id) {
    return delAdminByIdDao(id);
}


export async function getAdminByEmailPassword(email, password) {
    try {

        // validaion
        if (!isValidEmail(email)) {
            var error = new VALIATION_ERROR('Non Valid Email Arg', 'email');
            // error.code = 544;
            throw error;
        }

        if (!isValidPassword(password)) {
            throw new Error(`$password arg is not a valid password`);
        }

        // case admin (they loguin mostly and are just a few)
        // admin oulet
        var admin;
        // get admin if any
        // if not any will throw a not-found-error
        var admin = await getAdminByEmailService(email);


        if (!admin) {
            // if found and pass dont match do not bubble up that sensitive info
            throw new NOT_FOUND_RECORD_ERROR('User not found');
        }

        // check if match
        const passwordsMatch = await bcrypt.compare(password, admin.hash_password);
        if (!passwordsMatch) {
            throw new NOT_FOUND_RECORD_ERROR('User not found');
        }

        return admin;


    } catch (error) {
        throw error
    }
}