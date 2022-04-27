
import { createBooking, deleteBooking, getBookings, updateBookingState } from 'dao/booking/BookingDao';
import { createABookingState, deleteABookingState, getBookingStateByKey } from 'dao/booking/BookingStateDao';
import { createAPaymentType, deleteAPaymentType } from 'dao/payments/PaymentTypeDao';
import { BOOKING_STATES, getUserRoleId, USER_ROLES } from 'dao/DBConstans';
import { createHotel, deleteHotelById } from 'dao/HotelDao';
import { createRoom, deleteRoom } from 'dao/room/RoomDao';
import { createNonUserClient, deleteClient } from 'dao/users/ClientDao';
import { mapTimeToDateTime } from 'dao/utils';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid'
import { getUserRoleByKey } from 'dao/users/UserRoleDao';



var HOTEL, ROOM;

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

        // create room
        var roomData = {
            // hotel_id, await to run test functions to use global `customHotel.id`
            // room_type, await to run test functions to use global `customHotel.id`
            room_name: uuid().substring(0, 10),
            night_price: 10,
            capacity: 2,
            number_of_beds: 1
        }


        ROOM = await createRoom({
            hotel_id: HOTEL.id,
            room_name: roomData.room_name,
            night_price: roomData.night_price,
            number_of_beds: roomData.number_of_beds,
            capacity: roomData.capacity
        })

    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
})

afterAll(async () => {
    try {
        // delete room
        await deleteRoom(ROOM.id);
        // hotel
        await deleteHotelById(HOTEL.id);
    } catch (error) {
        console.log(error)
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
        month: utc_now.month - 2,
        day: utc_now.day - 10,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
    end_date: {
        year: utc_now.year,
        month: utc_now.month + 2,
        day: utc_now.day + 10,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
}

describe(
    'Booking State Dao',

    function () {
        // create a booking
        test(
            "Create, update state, fetch bookings and delete  a booking ",
            async function () {

                var dbError = null, booking = null, client = null,
                    bookingState = null, b_results = null, b_count = null, cancelState = null, updatedBooking = null;
                ;


                var clientRole = null;

                try {
                    clientRole = await getUserRoleByKey(USER_ROLES.CLIENT.user_role);
                    client = await createNonUserClient({
                        user_role: clientRole.id,
                        client_name: uuid().substring(0, 10),
                        client_last_name: uuid().substring(0, 10),
                    })

                    bookingState = await createABookingState(uuid().substring(0, 10));

                    booking = await createBooking({
                        client_id: client.id,
                        hotel_id: HOTEL.id,
                        booking_state_id: bookingState.id,
                        total_price: 50,
                        start_date: PERIOD_DATA.start_date,
                        end_date: PERIOD_DATA.end_date,
                        number_of_guests: 2,
                    });


                    cancelState = await getBookingStateByKey(BOOKING_STATES.CANCEL.key);

                    updatedBooking = await updateBookingState(booking.id, cancelState.id);


                    var { results, count } = await getBookings({
                        start_date_filter: BIGGEST_PERIOD_DATA.start_date,
                        end_date_filter: BIGGEST_PERIOD_DATA.end_date,
                        page: 1,
                        hotel_id: HOTEL.id
                    });

                    b_results = results;
                    b_count = count;
                    console.log({
                        bpd_start_date: BIGGEST_PERIOD_DATA.start_date,
                        booking,
                        updatedBooking,
                        b_results,
                        b_count
                    });
                    // clean
                    await deleteBooking(booking.id);
                    await deleteABookingState(bookingState.booking_state)
                    await deleteClient(client.id);

                    // await deleteClient(client.id)
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(booking.id).toBeDefined();
                expect(updatedBooking.id).toBe(booking.id);
                expect(updatedBooking.booking_state).toBe(cancelState.id);
                // bookings
                expect(b_results.length).toBeDefined();
                expect(b_results.length).toBeGreaterThan(0);
                expect(b_count).toBeDefined();
            }
        )




    })