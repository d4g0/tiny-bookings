import { 
    isInAdminRoles, 
    isValidEmail, 
    isValidUserName,
    isValidAdminDescription,
    isValidPassword

} from "dao/utils";




export function createAdminService({
    user_role,
    email,
    admin_name,
    admin_description,
    password,
    reset_token, // reset token for admin users are defered for now
}) {
    // validate args
    // hash password
    // save to db
    // return the saved admin obj 


    // user role validation
    if (!isInAdminRoles(user_role)) {
        throw new Error(`user_role argument dosen't match with the real records : user_role: ${user_role}`);
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
        throw new Error(`$hash_password arg is not a valid hash_password: ${'not-loged for privacy'}`);
    }

    // reset token defered for admins user for now


    // ok by now every argument it's valid
    // lets hash that password
    
}