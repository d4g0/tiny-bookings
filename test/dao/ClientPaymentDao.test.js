
import { createBooking } from 'dao/booking/BookingDao';
import { getBookingStateByKey } from 'dao/booking/BookingStateDao';
import { getCurrencyByKey } from 'dao/currencies/CurrencyDao';
import { BOOKING_STATES, CURRENCIES, getUserRoleId, PAYMENT_TYPES, USER_ROLES } from 'dao/DBConstans';
import { createHotel } from 'dao/HotelDao';
import { createAPaymentWithBooking, createAPaymentWithNoBooking, deleteAPayment, getPayments } from 'dao/payments/PaymentsDao';
import { getPaymentTypeByKey } from 'dao/payments/PaymentTypeDao';
import { createRoom } from 'dao/room/RoomDao';
import { createNonUserClient, deleteClient } from 'dao/users/ClientDao';
import { getUserRoleByKey } from 'dao/users/UserRoleDao';
import { mapTimeToDateTime, randStr } from 'dao/utils';
import { DateTime } from 'luxon';
import { createABookingAsAdmin } from 'services/bookings';
import { v4 as uuid } from 'uuid'


var HOTEL;
var CLIENT_USER_ROLE_ID = null;

beforeAll(async () => {
    try {
        // create hotel
        var hotelData = {
            hotel_name: uuid().substring(0, 10),
            maximun_free_calendar_days: 30,
            check_in_hour_time: { hours: 13, minutes: 30 },
            check_out_hour_time: { hours: 12, minutes: 0 },
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
                var d_hotel,
                    d_room,
                    c_b_res;
                const CLIENT_NAME = randStr();
                const CLIENT_LAST_NAME = randStr();

                try {

                    var {
                        hotel,
                        room1,
                        booking1
                    } = await prepareClientPaymentsDeps({
                        clanedar_length: 90,
                        booking_days_duration: 2,
                        client_name: CLIENT_NAME,
                        client_last_name: CLIENT_LAST_NAME
                    })
                    c_b_res = booking1;


                    var { results, count } = await getPayments({
                        start_date_filter: BIGGEST_PERIOD_DATA.start_date,
                        end_date_filter: BIGGEST_PERIOD_DATA.end_date,
                        page: 1,
                        hotel_id: hotel.id
                    });

                    
                    cp_results = results;
                    cp_count = count;

                    // console.log({ 
                    //     rci: results[0].client_id,
                    //     cp_rci: cp_results[0].client_id,
                    //     results: cp_results, 
                    //     count: cp_count, 
                    //     c_b_res, 
                    //     booking: c_b_res.results.booking,
                    //     client: c_b_res.results.client
                    // });
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }
                expect(dbError).toBeNull();
                expect(cp_results.length).toBe(1)
                expect(cp_count).toBe(1)
                expect(cp_results[0].client_id).toBe(c_b_res.results.client.id)

            }
        )

        async function prepareClientPaymentsDeps({
            clanedar_length = 90,
            booking_days_duration = 2,
            client_name,
            client_last_name
        }) {
            // create a hotel
            // create 2 rooms 
            // create 2 reservations

            // hotel
            var hotel = await createHotel({
                hotel_name: randStr(10),
                maximun_free_calendar_days: clanedar_length,
                check_in_hour_time: { hours: 10, minutes: 0 },
                check_out_hour_time: { hours: 10, minutes: 0 },
                iana_time_zone: 'America/Havana',
                minimal_prev_days_to_cancel: 5
            })

            console.log({ hotel });

            // room 1
            var room1 = await createRoom({
                hotel_id: hotel.id,
                room_name: 'Outlander 006',
                night_price: 150,
                capacity: 2,
                number_of_beds: 1
            })


            // dates deps
            const utc_now = DateTime.now().toUTC();

            const DATES_DATA = {
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
                    day: utc_now.day + booking_days_duration,
                    hour: utc_now.hour,
                    minute: utc_now.minute
                },
            }

            // reservation
            var booking1 = await createABookingAsAdmin({
                start_date: DATES_DATA.start_date,
                end_date: DATES_DATA.end_date,
                client_name,
                client_last_name,
                currency_id: 1,
                hotel_id: hotel.id,
                number_of_guests: 2,
                payment_type_id: 1,
                total_price: 2000,
                rooms_ids: [room1.id]
            })


            return {
                hotel,
                room1,
                booking1
            }
        }
    })