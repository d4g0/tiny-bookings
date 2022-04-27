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

import { isValidDateInput, isValidId, isValidPositiveInteger, isValidPrice, utcDate } from "dao/utils";
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


export async function getPayments({
    start_date_filter = { year, month, day, hour, minute },
    end_date_filter = { year, month, day, hour, minute },
    page = 1, // 1 start based count
    hotel_id
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

    if(!isValidId(hotel_id)){
        throw new Error('Non valid hotel id');
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

        var paymentsRes = await sql`
            select 
                *
            from 
                client_payments cp
            join booking b on (cp.booking_reference = b.id)
            where 
                cp.effectuated_at >= ${utc_start_date_filter.toISOString()}
            and 
                cp.effectuated_at <= ${utc_end_date_filter.toISOString()}
            and b.hotel_id = ${hotel_id}
            order by cp.effectuated_at
            limit ${LIMIT} offset ${OFFSET};
        `;

        var countRes = await sql`
            select 
                count(*)
            from 
                client_payments cp
            join booking b on (cp.booking_reference = b.id)
            where 
                cp.effectuated_at >= ${utc_start_date_filter.toISOString()}
            and 
                cp.effectuated_at <= ${utc_end_date_filter.toISOString()}
            and b.hotel_id = ${hotel_id}
        `;

        var results = paymentsRes;
        var count = +countRes[0].count;

        return {
            results,
            count
        }
    } catch (error) {
        throw error
    }
}

export async function deleteAPayment(payment_id) {


    try {
        if (!isValidId(payment_id)) {
            throw new Error('Non valid payment id')
        }

        var delRes = await sql`
            delete from client_payments cp where cp.id = ${payment_id} RETURNING *
        `
        var delPayment = delRes[0];
        return delPayment;
    } catch (error) {
        throw error
    }
}

export async function deletePaymentByBookingId(booking_id){
    if(!isValidId(booking_id)){
        throw new Error('Non valid booking_id')
    }

    try {
        var delClientPayments = await sql`
        delete from client_payments cp where cp.booking_reference = ${booking_id} RETURNING *
        `
        return delClientPayments[0];
    } catch (error) {
        throw error;
    }
}