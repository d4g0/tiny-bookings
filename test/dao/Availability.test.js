const { createHotel } = require("dao/HotelDao");
const { getRoomsAvailableIn, createRoom } = require("dao/room/RoomDao");
const { randStr } = require("dao/utils");
const { DateTime } = require("luxon");
const { createABookingAsAdmin } = require("services/bookings");

describe(
    'Availability Test',
    function () {



        // get rooms available
        test(
            "Get Rooms Available (fixed) ",
            async function () {
                var dbError = null;
                var room_data_of_expected_available = null;
                var room_data_of_expected_not_available = null;
                const DAYS = 2;
                const {
                    hotel,
                    room1,
                    room2,
                    booking1
                } = await prepareGetRoomsDataTestDeps(90, DAYS);

                try {


                    // dates deps
                    const utc_now = DateTime.now().toUTC();

                    // search intervals
                    const SEARCH_INTERVALS = {
                        expected_available: {
                            start_date: {
                                year: utc_now.year,
                                month: utc_now.month,
                                day: utc_now.day + DAYS,
                                hour: utc_now.hour + 1,
                                minute: utc_now.minute
                            },
                            end_date: {
                                year: utc_now.year,
                                month: utc_now.month,
                                day: utc_now.day + DAYS + 2,
                                hour: utc_now.hour,
                                minute: utc_now.minute
                            },
                        },
                        expected_unavailable: {
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
                                day: utc_now.day + DAYS,
                                hour: utc_now.hour,
                                minute: utc_now.minute
                            },
                        }
                    }


                    // expected available
                    room_data_of_expected_available = await getRoomsAvailableIn({
                        hotel_id: hotel.id,
                        hotel_calendar_length: hotel.maximun_free_calendar_days,
                        start_date: SEARCH_INTERVALS.expected_available.start_date,
                        end_date: SEARCH_INTERVALS.expected_available.end_date,
                    });

                    room_data_of_expected_not_available = await getRoomsAvailableIn({
                        hotel_id: hotel.id,
                        hotel_calendar_length: hotel.maximun_free_calendar_days,
                        start_date: SEARCH_INTERVALS.expected_unavailable.start_date,
                        end_date: SEARCH_INTERVALS.expected_unavailable.end_date,
                    })


                    console.log({
                        room_data_of_expected_available,
                        room_data_of_expected_not_available
                    });

                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                expect(dbError).toBeNull();
                // available assertions
                expect(room_data_of_expected_available.length).toBe(2); // 2 room1 and room2
                expect(room_data_of_expected_available[0]).toStrictEqual(room1);
                expect(room_data_of_expected_available[1]).toStrictEqual(room2);
                // unavailable assertions
                expect(room_data_of_expected_not_available.length).toBe(0);
            }
        )

        async function prepareGetRoomsDataTestDeps({
            clanedar_length = 90,
            booking_days_duration = 2
        }) {
            // create a hotel
            // create 2 rooms 
            // create 2 reservations

            // hotel
            var hotel = await createHotel({
                hotel_name: randStr(10),
                maximun_free_calendar_days: clanedar_length,
                check_in_hour_time: { hours: 10, mins: 0 },
                check_out_hour_time: { hours: 10, mins: 0 },
                iana_time_zone: 'America/Havana',
                minimal_prev_days_to_cancel: 5
            })

            // room 1
            var room1 = await createRoom({
                hotel_id: hotel.id,
                room_name: 'Outlander 006',
                night_price: 150,
                capacity: 2,
                number_of_beds: 1
            })

            var room2 = await createRoom({
                hotel_id: hotel.id,
                room_name: 'Imperial 006',
                night_price: 450,
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
                client_name: 'Reilly',
                client_last_name: 'Jhojansen Bawer',
                currency_id: 1,
                hotel_id: hotel.id,
                hotel_calendar_length: hotel.maximun_free_calendar_days,
                number_of_guests: 2,
                payment_type_id: 1,
                total_price: 2000,
                rooms_ids: [room1.id, room2.id]
            })


            return {
                hotel,
                room1,
                room2,
                booking1
            }
        }
    }
)