import { isValidPaymentType } from 'dao/utils';
import sql from 'db/postgres';


export async function createAPaymentType(payment_type) {
    if (!isValidPaymentType(payment_type)) {
        throw new Error('Non valid payment_type')
    }

    try {
        var paymentTypeRes = await sql`
        insert into
            payment_types (payment_type)
        values
            (${payment_type}) RETURNING *;
        `
        return paymentTypeRes[0]
    } catch (error) {
        throw error;
    }
}


export async function deleteAPaymentType(payment_type) {
    if (!isValidPaymentType(payment_type)) {
        throw new Error('Non valid payment_type')
    }

    try {
        var delPaymentTypeRes = await sql`
            delete from payment_types where  payment_type = ${payment_type}
            RETURNING *;
        `
        return delPaymentTypeRes[0]
    } catch (error) {
        throw error;
    }
}