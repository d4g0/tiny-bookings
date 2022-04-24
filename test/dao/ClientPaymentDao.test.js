
import { createBooking } from 'dao/booking/BookingDao';
import { getBookingStateByKey } from 'dao/booking/BookingStateDao';
import { getCurrencyByKey } from 'dao/currencies/CurrencyDao';
import { BOOKING_STATES, CURRENCIES, getUserRoleId, PAYMENT_TYPES, USER_ROLES } from 'dao/DBConstans';
import { createHotel } from 'dao/HotelDao';
import { createAPaymentWithBooking, createAPaymentWithNoBooking, deleteAPayment, getPayments } from 'dao/payments/PaymentsDao';
import { getPaymentTypeByKey } from 'dao/payments/PaymentTypeDao';
import { createNonUserClient, deleteClient } from 'dao/users/ClientDao';
import { getUserRoleByKey } from 'dao/users/UserRoleDao';
import { mapTimeToDateTime } from 'dao/utils';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid'


var HOTEL;
var CLIENT_USER_ROLE_ID = null;

beforeAll(async () => {
    try {
        // create hotel
        var hotelData = {
            hotel_name: uuid().substring(0, 10),
            maximun_free_calendar_days: 30,
            check_in_hour_time: mapTimeToDateTime({ hours: 13, mins: 30 }),
            check_out_hour_time: mapTimeToDateTime({ hours: 12, mins: 0 }),
            minimal_prev_days_to_cancel: 5,
            iana_time_zone: 'America/Lima'
        }
        HOTEL = await createHotel(hotelData);
        CLIENT_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.CLIENT.key)).id;

    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
})



const utc_now = DateTime.now().toUTC();

const PERIOD_DATA = {
    start_date: {
        year: utc_now.year,
        month: utc_now.month,
        day: utc_now.day,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
    end_date: {
        year: utc_now.year,
        month: utc_now.month,
        day: utc_now.day + 1,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
}


const BIGGEST_PERIOD_DATA = {
    start_date: {
        year: utc_now.year,
        month: utc_now.month - 3 > 0 ? utc_now.month - 3 : 0,
        day: utc_now.day - 10,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
    end_date: {
        year: utc_now.year,
        month: utc_now.month + 3 > 11 ? 11 : utc_now.month + 3,
        day: utc_now.day + 10,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
}




describe(
    'Client Payments Dao',

    function () {
        // create payments and delete
        test(
            "Create and delete a client payment with and with out booking ",
            async function () {

                var dbError = null,
                    cp = null,
                    cpB = null,
                    cashPaymentType = null,
                    usd = null,
                    booking = null,
                    delPayment = null
                    ;
                const PRICE = 300.50;
                try {
                    // client
                    var client = await createNonUserClient({
                        user_role: CLIENT_USER_ROLE_ID,
                        client_name: uuid().substring(0, 10),
                        client_last_name: uuid().substring(0, 10)
                    });

                    cashPaymentType = await getPaymentTypeByKey(PAYMENT_TYPES.CASH.key);
                    usd = await getCurrencyByKey(CURRENCIES.USD.key);

                    cp = await createAPaymentWithNoBooking({
                        client_id: client.id,
                        amount: PRICE,
                        payment_type: cashPaymentType.id,
                        currency: usd.id
                    });

                    // booking
                    var paidState = await getBookingStateByKey(BOOKING_STATES.PAID.key);

                    booking = await createBooking({
                        client_id: client.id,
                        hotel_id: HOTEL.id,
                        booking_state_id: paidState.id,
                        total_price: PRICE,
                        start_date: PERIOD_DATA.start_date,
                        end_date: PERIOD_DATA.end_date,
                        number_of_guests: 2,
                    });

                    cpB = await createAPaymentWithBooking({
                        client_id: client.id,
                        amount: PRICE,
                        payment_type: cashPaymentType.id,
                        currency: usd.id,
                        booking_id: booking.id
                    });

                    delPayment = await deleteAPayment(cp.id);


                    console.log({ cp, cpB })

                    // clean
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(cp.id).toBeDefined();
                expect(cp.client_id).toBeDefined();
                expect(cp.amount).toBeDefined();
                expect(cp.currency).toBeDefined();
                expect(cp.payment_type).toBeDefined();
                expect(cp.effectuated_at).toBeDefined();
                expect(cpB.booking_reference).toBeDefined()
                expect(delPayment.id).toBe(cp.id);
            }
        )


        test(
            "Get Client Payments",
            async function () {
                var dbError = null, cp_results, cp_count;


                try {
                    var { results, count } = await getPayments({
                        start_date_filter: BIGGEST_PERIOD_DATA.start_date,
                        end_date_filter: BIGGEST_PERIOD_DATA.end_date,
                        page: 1
                    });

                    console.log({ results, count });
                    cp_results = results;
                    cp_count = count;
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                expect(dbError).toBeNull();
                expect(cp_results.length).toBeDefined()
                expect(cp_count).toBeDefined()

            }
        )


    })