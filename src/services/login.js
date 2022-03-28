import { getAdminByEmail } from "dao/UserDao";
import { isValidString } from "dist/utils";

/**
 * Login Service
 * 
 */
export async function login({
    email,     //
    password   //
}) {

    // validate
    if (!isValidString(email)) {
        throw new Error(`Non valid string -email- argument: ${email}`)
    }
    if (!isValidString(password)) {
        throw new Error(`Non valid string -password- argument: ${password}`)
    }
    
    try {
        // TODO search in the clients collection too
        // search in admins
        const admin =  await getAdminByEmail();
        // case admin found
        if(admin){

            // compare password with hash_password
            var passwords_match = false;

            


        }


    } catch (error) {
        
        
    }
    



}