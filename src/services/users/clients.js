import bcrypt from "bcryptjs";
import { createUserClient } from "dao/users/ClientDao";
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