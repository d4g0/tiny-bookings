import { USER_ROLES } from "dao/DBConstans";
import { getAdminById, getAdminByEmail } from "dao/UserDao";
import {
    isInAdminRoles,
    isValidEmail,
    isValidUserName,
    isValidAdminDescription,
    isValidPassword,
    isValidId,
} from "dao/utils";
import bcrypt from "bcryptjs";
import { createAdmin } from '~/dao/UserDao'


/**
 * 
 * Creates and admin
 * Available for `FULL_ADMIN` role only
 */
export async function createAdminService({
    creator_admin_id,
    user_role,
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
    if (!isInAdminRoles(user_role)) {
        throw new Error(`$user_role argument dosen't match with the real records : user_role: ${user_role}`);
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
        if (!admin?.user_role == USER_ROLES.FULL_ADMIN.user_role) {
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
            user_role,
            email,
            admin_name,
            admin_description,
            hash_password: hashed_password,
        })

        return createdAdmin;

    } catch (error) {
        throw error
    }

}


export async function getAdminByEmailService(adminEmail) {
    return getAdminByEmail(adminEmail)
}



// WORKING ON THIS
export async function getUserByEmailPassword(email, password) {
    try {

        // validaion
        if (!isValidEmail(email)) {
            var error = new Error('Non Valid Email Arg');
            // error.code = 544;
            throw error;
        }

        if (!isValidPassword(password)) {
            throw new Error(`$password arg is not a valid password`);
        }


        // user oulet
        var user;
        // get admin if any
        var user = await getAdminByEmailService(email);

        // get client if not admin found
        // implement
        if(!user){
            throw new Error('User does not exists');
        }

        

        // check if match
        const passwordsMatch = await bcrypt.compare(password, user.hash_password);
        if (passwordsMatch) {
            return user;
        }
        if (!user) {
            var error = new Error('User does not exist');
            error.code = 404;
            throw error
        }

    } catch (error) {
        throw error
    }
}