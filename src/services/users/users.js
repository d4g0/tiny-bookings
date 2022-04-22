import bcrypt from "bcryptjs";
import { getClientByEmail } from "dao/users/ClientDao";
import { isValidEmail, isValidPassword } from "dao/utils";
import { getAdminByEmailService } from "./admin";

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

        // case admin (they loguin mostly and are just a few)
        // admin oulet
        var admin;
        // get admin if any
        // if not any will throw a not-found-error
        var admin = await getAdminByEmailService(email);


        if (admin) {
            // check if match
            const passwordsMatch = await bcrypt.compare(password, admin.hash_password);
            if (passwordsMatch) {
                return admin;
            }
        }


        // case client
        const client = await getClientByEmail(email);

        if (client) {
            const passwordsMatch = await bcrypt.compare(password, client.hash_password);
            if (passwordsMatch) {
                return client;
            }
        }
        // if found and pass dont match do not bubble up that sensitive info
        throw new NOT_FOUND_RECORD_ERROR('User not found');

    } catch (error) {
        throw error
    }
}