import { AVAILABILITY_ERROR_KEY, DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createHotel, deleteHotelById } from "dao/HotelDao";
import { createRoom, deleteRoom } from "dao/room/RoomDao";
import { createARoomLockPeriod, deleteRoomLockPeriod } from "dao/room/RoomLock";
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

describe(
    'Room Lock Period Dao',

    function roomTypesDaoTest() {
        // create a room lock
        test(
            "Create and delete room_lock_period ",
            async function () {

                var dbError = null, roomLockPeriod = null;

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
                    console.log({ roomLockPeriod, deletedRoomLockPeriod })
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
                    console.log({ roomLockPeriod, res2 });
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBeDefined();
                expect(dbError.code).toBe(AVAILABILITY_ERROR_KEY);
            }
        )




        // test(
        //     "Create and delete room_lock_period for a booking ",
        //     async function () {

        //         var dbError = null, roomLockPeriod = null, booking = null;

        //         try {
        //             roomLockPeriod = await createARoomLockPeriod({
        //                 room_id: ROOM.id,
        //                 reason: '[Gardining] We are going to grow some plants in this room',
        //                 start_date: ROOM_LOCK_PERIOD_DATA.start_date,
        //                 end_date: ROOM_LOCK_PERIOD_DATA.end_date,
        //                 hotel_calendar_length: HOTEL.maximun_free_calendar_days,
        //             });
        //             // clean
        //             var deletedRoomLockPeriod = await deleteRoomLockPeriod(roomLockPeriod.id)
        //             console.log({ roomLockPeriod, deletedRoomLockPeriod })
        //         } catch (error) {
        //             dbError = error;
        //             console.log(error);
        //         }

        //         expect(dbError).toBe(null);
        //         expect(deletedRoomLockPeriod.room_id).toBeDefined()
        //         expect(roomLockPeriod.room_id).toBeDefined()
        //         expect(roomLockPeriod.start_date).toBeDefined()
        //         expect(roomLockPeriod.end_date).toBeDefined()
        //         expect(roomLockPeriod.reason).toBeDefined()
        //         expect(roomLockPeriod.created_at).toBeDefined()

        //     }
        // )
    })