import { deleteRoomBookingsByBookingId } from 'dao/booking/RoomsBookingsDao';
import { getCurrencyByKey } from 'dao/currencies/CurrencyDao';
import { CURRENCIES, PAYMENT_TYPES } from 'dao/DBConstans';
import { createHotel, deleteHotelById } from 'dao/HotelDao';
import { getPaymentTypeByKey } from 'dao/payments/PaymentTypeDao';
import { createRoom, deleteRoom } from 'dao/room/RoomDao';
import { deleteRoomLocksByBookingId, getRoomLocksByBookingId } from 'dao/room/RoomLock';
import { mapTimeToDateTime } from 'dao/utils';
import { DateTime } from 'luxon';
import { createABookingAsAdmin } from 'services/bookings';
import { v4 as uuid } from 'uuid'


var HOTEL, ROOM, ROOM_2;

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

        // create room
        var roomData = {
            // hotel_id, await to run test functions to use global `customHotel.id`
            // room_type, await to run test functions to use global `customHotel.id`
            room_name: uuid().substring(0, 10),
            night_price: 10,
            capacity: 2,
            number_of_beds: 1
        }

        var roomData_2 = {
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

        ROOM_2 = await createRoom({
            hotel_id: HOTEL.id,
            room_name: roomData_2.room_name,
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
        // await deleteRoom(ROOM.id);
        // await deleteRoom(ROOM_2.id);
        // hotel
        // await deleteHotelById(HOTEL.id);
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

const CLIENT_DATA = {
    client_name: uuid().substring(0, 10),
    client_last_name: uuid().substring(0, 10)
}



describe(
    'Booking Service',
    function () {

        test(
            `Create a booking as admin 
            + getRoomLocksByBookingId
            + delRoomLocksByBookingId
            + delRoomBookingsByBookingId
            
            `,
            async function () {
                var dbError = null, t_completed = false, t_error = null;
                var usd = null, cash = null;
                var t_results = null;
                var roomLocks = null;
                var delRoomLocks = null;
                var delRoomBookings = null;
                try {

                    usd = await getCurrencyByKey(CURRENCIES.USD.key);
                    cash = await getPaymentTypeByKey(PAYMENT_TYPES.CASH.key);

                    var { completed, error, results } = await createABookingAsAdmin({
                        start_date: PERIOD_DATA.start_date,
                        end_date: PERIOD_DATA.end_date,
                        rooms_ids: [ROOM.id, ROOM_2.id],
                        hotel_id: HOTEL.id,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                        client_name: CLIENT_DATA.client_name,
                        client_last_name: CLIENT_DATA.client_last_name,
                        currency_id: usd.id,
                        number_of_guests: 4,
                        payment_type_id: cash.id,
                        total_price: 300
                    })

                    t_completed = completed;
                    t_error = error;
                    t_results = results;

                    var booking = results.booking;
                    roomLocks = await getRoomLocksByBookingId(booking.id)
                    delRoomLocks = await deleteRoomLocksByBookingId(booking.id);
                    delRoomBookings = await deleteRoomBookingsByBookingId(booking.id);

                    console.log('---- completed -----')
                    console.log({ completed });
                    console.log('---- error -----')
                    console.log(error)
                    console.log('---- results -----')
                    console.log(results)
                    console.log('---- roomLocks -----')
                    console.log(roomLocks)
                    console.log('---- delRoomBookings -----')
                    console.log(delRoomBookings)


                } catch (error) {
                    dbError = error;
                    console.log(error)
                }

                expect(t_completed).toBe(true);
                expect(t_error).toBeNull();
                expect(t_results.client.id).toBeDefined();
                expect(t_results.booking.id).toBeDefined();
                expect(t_results.clientPayment.id).toBeDefined();
                expect(t_results.roomLocks.length).toBe(2);
                expect(t_results.roomBookings.length).toBe(2);
                // room locks fetch
                expect(roomLocks.length).toBe(2);
                var rl = roomLocks[0];
                expect(rl.id).toBeDefined();
                expect(rl.room_id).toBeDefined();
                expect(rl.start_date).toBeDefined();
                expect(rl.end_date).toBeDefined();
                expect(rl.reason).toBeDefined();
                expect(rl.created_at).toBeDefined();
                expect(rl.during).toBeDefined();
                expect(rl.is_a_booking).toBe(true);
                expect(rl.booking_id).toBeDefined();
                // del room locks by booking id
                expect(delRoomLocks.length).toBe(2);
                expect(roomLocks[0]).toStrictEqual(delRoomLocks[0]);
                // del room bookings by id
                expect(delRoomBookings.length).toBe(2);
                expect(delRoomBookings[0]).toStrictEqual(results.roomBookings[0]);
            }
        )

    }
)