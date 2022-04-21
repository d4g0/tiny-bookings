import { PAYMENT_TYPES, setPaymentTypeId } from 'dao/DBConstans';
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

/**
 * Seed DB Constants Payment Types
 * As Payment Types should behave like 
 * Enums in db, but pgadmin erd tool don't 
 * cover those, and schema is been developed there
 * This secuence makes sure they required payment types constants
 * Are present, and set their relative ids in db for later
 * reuse.
 */
export async function initPaymentTypes() {
    try {

        // cash type
        var cash = await getPaymentTypeByKey(PAYMENT_TYPES.CASH.key);
        if (!cash) {
            cash = await createAPaymentType(PAYMENT_TYPES.CASH.key);
        }

        setPaymentTypeId(cash.payment_type, cash.id);        


    } catch (error) {
        throw error
    }
}


export async function getPaymentTypeByKey(payment_type_key) {

    if (!isValidPaymentType(payment_type_key)) {
        throw new Error('Non valid payment_type_key')
    }

    var bSRes = await sql`
        select * from payment_types pt where pt.payment_type = ${payment_type_key}
    `

    var bookingState = bSRes.length > 0 ? bSRes[0] : null;
    return bookingState;
}


export async function getPaymentTypes() {
    try {
        var pt = await sql`
            select * from payment_types;
        `

        return pt;
    } catch (error) {
        throw error
    }
}