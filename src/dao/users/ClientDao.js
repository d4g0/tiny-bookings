import { USER_ROLES } from 'dao/DBConstans';
import { DB_UNIQUE_CONSTRAINT_ERROR } from 'dao/Errors';
import { isValidId, isValidClientName, isValidEmail, isValidUserName, isValidPassword, isValidDateInput, isValidPositiveInteger, utcDate } from 'dao/utils';
import sql from 'db/postgres';
import { isValidString } from 'utils';
import { getUserRoleByKey } from './UserRoleDao';


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
            select 
                cl.id,
                ur.user_role,
                cl.client_name,
                cl.client_last_name,
                cl.hash_password,
                cl.email,
                cl.is_email_verified,
                cl.reset_token,
                cl.created_at 
            from 
                clients cl 
            join 
                user_roles ur on( cl.user_role = ur.id) 
            where cl.email = ${email};
            
        `;

        var client = clientRes.length > 0 ? clientRes[0] : null;
        return client;

    } catch (error) {
        throw error;
    }
}

export async function createUserClient({
    client_name,
    client_last_name,
    hash_password,
    email,
}) {

    // validation
    if (!isValidClientName(client_name)) {
        throw new Error('Non valid client name')
    }
    if (!isValidClientName(client_last_name)) {
        throw new Error('Non valid client last name')
    }
    if (!isValidString(hash_password)) {
        throw new Error('Non valid hash password')
    }
    if (!isValidEmail(email)) {
        throw new Error('Non valid email');
    }

    // save
    try {

        var clientRes = await sql`
        with i_cli as 
            ( 
                insert into 
                    clients (
                        user_role, 
                        client_name, 
                        client_last_name,
                        hash_password,
                        email
                    ) 
                values (
                    (select ur.id from user_roles ur where ur.user_role = 'CLIENT'),
                    ${client_name},
                    ${client_last_name},
                    ${hash_password},
                    ${email}
                ) RETURNING
                    clients.id,
                    clients.user_role,
                    clients.client_name,
                    clients.client_last_name,
                    clients.hash_password,	
                    clients.email,
                    clients.is_email_verified,
                    clients.reset_token,
                    clients.created_at
            ) 
            select 
                    i_cli.id,
                    ur.user_role,
                    i_cli.client_name,
                    i_cli.client_last_name,
                    i_cli.hash_password,	
                    i_cli.email,
                    i_cli.is_email_verified,
                    i_cli.reset_token,
                    i_cli.created_at
            from i_cli join user_roles ur on (i_cli.user_role = ur.id )
        ;
        `;

        var client = clientRes[0]
        return client;

    } catch (error) {
        // duplicated key postgres error
        if (error?.code == '23505') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Duplicated Client email', 'email')
        }
        throw error;
    }
}

export async function getClientById(clientId) {
    if (!isValidId(clientId)) {
        throw new Error('Non valid client id');
    }

    try {
        var cRes = await sql`
        select 
                clients.id,
                ur.user_role,
                clients.client_name,
                clients.client_last_name,
                clients.hash_password,	
                clients.email,
                clients.is_email_verified,
                clients.reset_token,
                clients.created_at
        from clients join user_roles ur on (clients.user_role = ur.id )
        where clients.id = ${clientId};
        `

        var client = cRes.length > 0 ? cRes[0] : null
        return client;
    } catch (error) {
        throw error;
    }
}


export async function getClients({
    start_date_filter = { year, month, day, hour, minute },
    end_date_filter = { year, month, day, hour, minute },
    page = 1, // 1 start based count
}) {

    // validation
    if (!isValidDateInput(start_date_filter)) {
        throw new Error('Non valid start_date_filter')
    }
    if (!isValidDateInput(end_date_filter)) {
        throw new Error('Non valid end_date_filter')
    }
    if (!isValidPositiveInteger(page)) {
        throw new Error('Non valid page, positive integer expected')
    }

    const LIMIT = 50;
    const OFFSET = (page - 1) * LIMIT;

    var utc_start_date_filter = utcDate({
        year: start_date_filter.year,
        month: start_date_filter.month,
        day: start_date_filter.day,
        hour: start_date_filter.hour,
        minute: start_date_filter.minute
    });
    var utc_end_date_filter = utcDate({
        year: end_date_filter.year,
        month: end_date_filter.month,
        day: end_date_filter.day,
        hour: end_date_filter.hour,
        minute: end_date_filter.minute
    });

    try {

        var clientRes = await sql`
        select 
            cl.id,
            ur.user_role,
            cl.client_name,
            cl.client_last_name,
            cl.hash_password,
            cl.email,
            cl.is_email_verified,
            cl.reset_token,
            cl.created_at
        from 
            clients cl
        join 
            user_roles ur on( cl.user_role = ur.id) 
        where 
            cl.created_at >= ${utc_start_date_filter.toISOString()}
        and
            cl.created_at <= ${utc_end_date_filter.toISOString()}
        ORDER BY cl.created_at desc
        LIMIT ${LIMIT} OFFSET ${OFFSET} ;
        `

        var countRes = await sql`
        select 
           count(*)
        from 
            clients cl
        join 
            user_roles ur on( cl.user_role = ur.id) 
        where 
            cl.created_at >= ${utc_start_date_filter.toISOString()}
        and
            cl.created_at <= ${utc_end_date_filter.toISOString()};
        `;

        var results = clientRes
        var count = +countRes[0].count
        return {
            results,
            count
        }

    } catch (error) {
        throw error
    }
}


// defered
// export async function updateClientName() {

// }

// export async function updateClientLastName() {

// }

// export async function updateClientHashPassw() {

// }