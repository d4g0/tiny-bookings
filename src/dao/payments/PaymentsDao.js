/**
 * 
 * Create a payment
 *      with booking reference
 *      without booking reference
 * 
 * Get Payments
 * Get Payments by client id
 * 
 */

import { isValidId, isValidPrice } from "dao/utils";
import sql from "db/postgres";

export async function createAPaymentWithNoBooking({
    client_id,
    amount,
    payment_type,
    currency,
}) {

    if (!isValidId(client_id)) {
        throw new Error('Non valid client id')
    }

    if (!isValidId(payment_type)) {
        throw new Error('Non valid payment_type')
    }

    if (!isValidId(currency)) {
        throw new Error('Non valid currency')
    }

    if (!isValidPrice(amount)) {
        throw new Error('Non valid amount')
    }

    try {
        var pRes = await sql`
        insert into 
            client_payments ( 
                client_id,
                amount,
                payment_type,
                currency 
            )
        values (
            ${client_id},
            ${amount},
            ${payment_type},
            ${currency}
        ) RETURNING *;   
        `
        var clientPayment = pRes[0]
        return clientPayment;
    } catch (error) {
        throw error;
    }

}


export async function createAPaymentWithBooking({
    client_id,
    amount,
    payment_type,
    currency,
    booking_id,
}) {

    if (!isValidId(client_id)) {
        throw new Error('Non valid client id')
    }

    if (!isValidId(payment_type)) {
        throw new Error('Non valid payment_type')
    }

    if (!isValidId(currency)) {
        throw new Error('Non valid currency')
    }

    if (!isValidId(booking_id)) {
        throw new Error('Non valid booking_id')
    }

    if (!isValidPrice(amount)) {
        throw new Error('Non valid amount')
    }

    try {
        var pRes = await sql`
        insert into 
            client_payments ( 
                client_id,
                amount,
                payment_type,
                currency,
                booking_reference

            )
        values (
            ${client_id},
            ${amount},
            ${payment_type},
            ${currency},
            ${booking_id}
        ) RETURNING *;   
        `
        var clientPayment = pRes[0]
        return clientPayment;
    } catch (error) {
        throw error;
    }

}