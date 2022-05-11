import bcrypt from "bcryptjs";
import { NOT_FOUND_RECORD_ERROR, VALIATION_ERROR } from "dao/Errors";
import { createUserClient, getClientByEmail } from "dao/users/ClientDao";
import { isValidClientName, isValidEmail, isValidPassword, isValidUserName } from "dao/utils";

export async function singUp({
    client_name,
    client_last_name,
    password,
    email,
}) {
    // validation
    if (!isValidClientName(client_name)) {
        throw new Error('Non valid client name')
    }
    if (!isValidClientName(client_last_name)) {
        throw new Error('Non valid client last name')
    }
    if (!isValidPassword(password)) {
        throw new Error('Non valid hash password')
    }
    if (!isValidEmail(email)) {
        throw new Error('Non valid email');
    }


    const hash = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(password, hash);

    try {
        var client = await createUserClient({
            client_name,
            client_last_name,
            email,
            hash_password: hashed_password
        })

        return client;
    } catch (error) {
        throw error;
    }
}


export async function getClientByEmailPassword(email, password) {
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

        const client = await getClientByEmail(email);


        if (!client) {
            // if found and pass dont match do not bubble up that sensitive info
            throw new NOT_FOUND_RECORD_ERROR('User not found');
        }

        // check if match
        const passwordsMatch = await bcrypt.compare(password, client.hash_password);
        if (!passwordsMatch) {
            throw new NOT_FOUND_RECORD_ERROR('User not found');
        }

        return client;


    } catch (error) {
        throw error
    }
}
