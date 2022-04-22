import { isValidId, isValidClientName, isValidEmail } from 'dao/utils';
import sql from 'db/postgres';


export async function createNonUserClient({
    user_role,
    client_name,
    client_last_name
}) {
    if (!isValidId(user_role)) {
        throw new Error('Non valid user role');
    }
    if (!isValidClientName(client_name)) {
        throw new Error('Non valid client_name')
    }
    if (!isValidClientName(client_last_name)) {
        throw new Error('Non valid client_last_name')
    }

    try {
        var clientRes = await sql`
            insert into
                clients (user_role, client_name, client_last_name)
            values
                (${user_role}, ${client_name}, ${client_last_name}) RETURNING *;
        `
        return clientRes[0];
    } catch (error) {
        throw error;
    }
}

export async function deleteClient(client_id) {
    if (!isValidId(client_id)) {
        throw new Error('Non valid client_id');
    }

    try {
        var delClientRes = await sql`
        delete from clients c where c.id = ${client_id} RETURNING *;
        `
        return delClientRes[0];
    } catch (error) {
        throw error;
    }
}


export async function getClientByEmail(email) {
    if (!isValidEmail(email)) {
        throw new Error('Non valid email')
    };

    try {

        var clientRes = await sql`
            select * from clients cl where cl.email = ${email};
        `;

        var client = clientRes.length > 0 ? clientRes[0] : null;
        return client;

    } catch (error) {
        throw error;
    }
}

export async function createUserClient() {

}

export async function getClient() {

}

export async function getClients() {

}


export async function updateClientName() {

}

export async function updateClientLastName() {

}

export async function updateClientHashPassw() {

}