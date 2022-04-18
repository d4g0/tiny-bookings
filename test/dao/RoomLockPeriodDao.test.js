import { createBooking, deleteBooking } from "dao/booking/BookingDao";
import { createABookingState, deleteABookingState } from "dao/booking/BookingStateDao";
import { createAPaymentType, deleteAPaymentType } from "dao/booking/PaymentTypeDao";
import { createARoomBooking, deleteARoomBooking } from "dao/booking/RoomsBookingsDao";
import { getUserRoleId, USER_ROLES } from "dao/DBConstans";
import { AVAILABILITY_ERROR_KEY, DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createHotel, deleteHotelById } from "dao/HotelDao";
import { createRoom, deleteRoom } from "dao/room/RoomDao";
import { createARoomLockPeriod, deleteRoomLockPeriod, getARoomLocks, getRoomLocks } from "dao/room/RoomLock";
import { createNonUserClient, deleteClient } from "dao/users/ClientDao";
import { mapDateToHourTime, mapTimeToDateTime } from "dao/utils";
import { date } from "joi";
import { DateTime } from "luxon";
import { v4 as uuid } from 'uuid'

// need deps
// a hotel and a room

var HOTEL, ROOM;

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
        HOTEL.check_in_hour_time
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

const ROOM_LOCK_PERIOD_DATA = {
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


const PERIOD_DATA = {
    start_date: {
        year: utc_now.year,
        month: utc_now.month,
        day: utc_now.day + 3,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
    end_date: {
        year: utc_now.year,
        month: utc_now.month,
        day: utc_now.day + 4,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
}


const BIGGEST_PERIOD_DATA = {
    start_date: {
        year: utc_now.year,
        month: utc_now.month,
        day: utc_now.day - 10,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
    end_date: {
        year: utc_now.year,
        month: utc_now.month,
        day: utc_now.day + 10,
        hour: utc_now.hour,
        minute: utc_now.minute
    },
}

describe(
    'Room Lock Period Dao',

    function roomTypesDaoTest() {
        // create a room lock
        test(
            "Create and delete room_lock_period ",
            async function () {

                var dbError = null, roomLockPeriod = null, f_end_date = null;
                console.log({
                    start_date: ROOM_LOCK_PERIOD_DATA.start_date,
                    end_date: ROOM_LOCK_PERIOD_DATA.end_date,
                });

                try {
                    roomLockPeriod = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: '[Gardining] We are going to grow some plants in this room',
                        start_date: ROOM_LOCK_PERIOD_DATA.start_date,
                        end_date: ROOM_LOCK_PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                    });
                    // clean
                    var deletedRoomLockPeriod = await deleteRoomLockPeriod(roomLockPeriod.id)
                    f_end_date = DateTime.fromSQL(roomLockPeriod.end_date, { zone: 'utc' });
                    // console.log({ roomLockPeriod, deletedRoomLockPeriod })
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                // date validaton

                expect(deletedRoomLockPeriod.room_id).toBeDefined()
                expect(f_end_date.day).toBe(ROOM_LOCK_PERIOD_DATA.end_date.day);
                expect(f_end_date.hour).toBe(ROOM_LOCK_PERIOD_DATA.end_date.hour);
                expect(f_end_date.minute).toBe(ROOM_LOCK_PERIOD_DATA.end_date.minute);
                expect(roomLockPeriod.room_id).toBeDefined()
                expect(roomLockPeriod.start_date).toBeDefined()
                expect(roomLockPeriod.end_date).toBeDefined()
                expect(roomLockPeriod.reason).toBeDefined()
                expect(roomLockPeriod.created_at).toBeDefined()

            }
        )


        // bloked period error check
        test(
            "Attemp to create a room_lock period in a blocked period ",
            async function () {

                var dbError = null, roomLockPeriod = null, res2 = null;

                try {
                    roomLockPeriod = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: 'create 2 with same dates',
                        start_date: ROOM_LOCK_PERIOD_DATA.start_date,
                        end_date: ROOM_LOCK_PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                    });

                    res2 = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: '[Gardining] We are going to grow some plants in this room',
                        start_date: ROOM_LOCK_PERIOD_DATA.start_date,
                        end_date: ROOM_LOCK_PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                    });

                } catch (error) {
                    // clean
                    var deletedRoomLockPeriod = await deleteRoomLockPeriod(roomLockPeriod.id)
                    // console.log({ roomLockPeriod, res2 });
                    dbError = error;
                    // console.log(error);
                }

                expect(dbError).toBeDefined();
                expect(dbError.code).toBe(AVAILABILITY_ERROR_KEY);
            }
        )



        // room lock period for booking
        test(
            "Create and delete room_lock_period + deps for a booking ",
            async function () {

                var dbError = null,
                    roomLockPeriod = null,
                    booking = null,
                    bookingState = null,
                    client = null,
                    bookingState = null,
                    paymentType = null,
                    deletedRoomLockPeriod = null,
                    room_booking_record = null
                    ;

                try {
                    // create room lock for booking deps
                    client = await createNonUserClient({
                        user_role: getUserRoleId(USER_ROLES.CLIENT.user_role),
                        client_name: uuid().substring(0, 10),
                        client_last_name: uuid().substring(0, 10),
                    })

                    bookingState = await createABookingState(uuid().substring(0, 10));
                    paymentType = await createAPaymentType(uuid().substring(0, 10));


                    booking = await createBooking({
                        client_id: client.id,
                        hotel_id: HOTEL.id,
                        booking_state_id: bookingState.id,
                        payment_type_id: paymentType.id,
                        total_price: 50,
                        start_date: PERIOD_DATA.start_date,
                        end_date: PERIOD_DATA.end_date,
                        number_of_guests: 2
                    });



                    roomLockPeriod = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: 'Gardening',
                        start_date: PERIOD_DATA.start_date,
                        end_date: PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                        is_a_booking: true,
                        booking_id: booking.id
                    });

                    room_booking_record = await createARoomBooking(ROOM.id, booking.id);
                    // console.log({
                    //     client,
                    //     bookingState,
                    //     paymentType,
                    //     booking,
                    //     roomLockPeriod,
                    //     room_booking_record
                    // })

                    // clean
                    await deleteARoomBooking(ROOM.id, booking.id);
                    deletedRoomLockPeriod = await deleteRoomLockPeriod(roomLockPeriod.id);
                    await deleteBooking(booking.id);
                    await deleteAPaymentType(paymentType.payment_type)
                    await deleteABookingState(bookingState.booking_state)
                    await deleteClient(client.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(deletedRoomLockPeriod.room_id).toBeDefined()
                expect(roomLockPeriod.room_id).toBeDefined()
                expect(roomLockPeriod.start_date).toBeDefined()
                expect(roomLockPeriod.end_date).toBeDefined()
                expect(roomLockPeriod.reason).toBeDefined()
                expect(roomLockPeriod.is_a_booking).toBe(true);
                expect(roomLockPeriod.booking_id).toBeDefined();
                expect(roomLockPeriod.during).toBeDefined();
                expect(roomLockPeriod.created_at).toBeDefined()
            }
        )

        // get room locks
        test(
            "Get room_locks_periods",
            async function () {

                var dbError = null, f_results = null, f_count = null;

                try {

                    // create some locks to fetch
                    var rl1 = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: '[Gardining] We are going to grow some plants in this room',
                        start_date: ROOM_LOCK_PERIOD_DATA.start_date,
                        end_date: ROOM_LOCK_PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                    });

                    var rl2 = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: '[Gardining] We are going to grow some plants in this room',
                        start_date: PERIOD_DATA.start_date,
                        end_date: PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                    });
                    // clean


                    // fetch results
                    var { results, count } = await getRoomLocks({
                        start_date_filter: BIGGEST_PERIOD_DATA.start_date,
                        end_date_filter: BIGGEST_PERIOD_DATA.end_date,
                        page: 1
                    });

                    f_results = results;
                    f_count = count;

                    console.log({
                        f_results,
                        f_count
                    })

                    // clean
                    await deleteRoomLockPeriod(rl1.id)
                    await deleteRoomLockPeriod(rl2.id)
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(f_results).toBeDefined();
                expect(f_results.length).toBeDefined();
                expect(f_count).toBeDefined();
            }
        )

        // get a room locks
        test(
            "Get a room is room_locks_periods",
            async function () {

                var dbError = null, f_results = null, f_count = null;

                try {

                    // create some locks to fetch
                    var rl1 = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: '[Gardining] We are going to grow some plants in this room',
                        start_date: ROOM_LOCK_PERIOD_DATA.start_date,
                        end_date: ROOM_LOCK_PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                    });

                    var rl2 = await createARoomLockPeriod({
                        room_id: ROOM.id,
                        reason: '[Gardining] We are going to grow some plants in this room',
                        start_date: PERIOD_DATA.start_date,
                        end_date: PERIOD_DATA.end_date,
                        hotel_calendar_length: HOTEL.maximun_free_calendar_days,
                    });
                    // clean


                    // fetch results
                    var { results, count } = await getARoomLocks({
                        start_date_filter: BIGGEST_PERIOD_DATA.start_date,
                        end_date_filter: BIGGEST_PERIOD_DATA.end_date,
                        page: 1,
                        room_id_filter: ROOM.id
                    });

                    f_results = results;
                    f_count = count;

                    console.log({
                        f_results,
                        f_count
                    })

                    // clean
                    await deleteRoomLockPeriod(rl1.id)
                    await deleteRoomLockPeriod(rl2.id)
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(f_results).toBeDefined();
                expect(f_results.length).toBeDefined();
                expect(f_count).toBeDefined();
            }
        )
    })