import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createHotel, deleteHotelById } from "dao/HotelDao";
import { v4 as uuid } from 'uuid';
import { mapTimeToDateTime } from 'dao/utils';
import { createRoom, deleteRoom, getRoomById, updateARoomIsType, updateRoomName } from "dao/room/RoomDao";
import { createRoomType, deleteRoomTypeByType } from "dao/room/RoomTypesDao";
import { createARoomPicture, deleteARoomPicture } from "dao/room/RoomPicturesDao";
describe(
    'Room Dao',

    function roomDaoTest() {

        var customHotel;
        var customRoomType;
        beforeAll(async () => {

            try {
                // create a hotel for use it in the tests
                customHotel = await createHotel({
                    hotel_name: uuid().substring(10),
                    maximun_free_calendar_days: 30,
                    check_in_hour_time: mapTimeToDateTime({ hours: 13, mins: 30 }),
                    check_out_hour_time: mapTimeToDateTime({ hours: 12, mins: 0 }),
                    minimal_prev_days_to_cancel: 5,
                    iana_time_zone: 'America/Lima'
                });

                // create a room type for use it
                customRoomType = await createRoomType(
                    // 'supper fussy'
                    uuid().substring(10)
                );

            } catch (error) {
                console.log(error);
            }
        })

        afterAll(async () => {
            try {
                // Pending Clean TODO
                // make sure there is not dependent room at this point ok
                // clean created roomType
                await deleteRoomTypeByType(customRoomType.room_type);
                // clean created hotel
                await deleteHotelById(customHotel.id); // delete depending room first TODO
            } catch (error) {
                console.log(error);
            }
        })



        var roomData = {
            // hotel_id, await to run test functions to use global `customHotel.id`
            // room_type, await to run test functions to use global `customHotel.id`
            room_name: uuid().substring(0, 10),
            night_price: 10,
            capacity: 2,
            number_of_beds: 1
        }

        var gloablAmenities = [
            'Air conditioner',
            'Jacussi',
            'Mini Bar',
            'Desktop',
            'TV',
            'Safe Box',
        ]

        test(
            "Create and delete room",
            async function () {
                var dbError = null, room = null;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    // console.log({ room });

                    await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(room.id).toBeDefined()
                expect(room.hotel_id).toBeDefined()
                expect(room.room_name).toBeDefined()
                expect(room.night_price).toBeDefined()
                expect(room.number_of_beds).toBeDefined()
                expect(room.capacity).toBeDefined()
                expect(room.created_at).toBeDefined()

            }
        )

        test(
            "Update a room name",
            async function () {
                var dbError = null, room = null, NEW_NAME = uuid().substring(0, 10);

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    // update
                    var u_room = await updateRoomName(room.id, NEW_NAME);

                    // console.log({ u_room })


                    await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(room.id).toBeDefined()
                expect(u_room.room_name).toBe(NEW_NAME);

            }
        )


        test(
            "Update a Room is Type",
            async function () {

                var dbError = null, room = null, roomType = null, ROOM_TYPE_KEY = uuid().substring(0, 10);

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    // create a room_type to use it
                    roomType = await createRoomType(ROOM_TYPE_KEY);
                    // console.log({ roomType })
                    // update
                    var u_room = await updateARoomIsType(room.id, roomType.id);

                    // console.log({ u_room })

                    // clean
                    await deleteRoom(room.id);
                    await deleteRoomTypeByType(roomType.room_type)
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(room.id).toBeDefined()
                expect(u_room.room_type).toBe(ROOM_TYPE_KEY); // wait till maping

            }
        )


        test(
            "Get a room with pictures",
            async function () {
                var dbError = null, room = null, roomPicture = null, FILE_NAME = 'supper-foo-picture', fetch_room = null;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    });

                    roomPicture = await createARoomPicture(room.id, FILE_NAME);

                    fetch_room = await getRoomById(room.id);

                    // console.log({
                    //     roomPicture,
                    //     fetch_room,
                    //     f_rp: fetch_room.room_pictures
                    // });


                    await deleteARoomPicture(roomPicture.id);
                    await deleteRoom(room.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }
            }
        )


        test(
            "Get a room with picures and  room type",
            async function () {
                var dbError = null, room = null, roomPicture = null, FILE_NAME = 'supper-foo-picture', fetch_room = null;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    });

                    roomPicture = await createARoomPicture(room.id, FILE_NAME);

                    await updateARoomIsType(room.id, customRoomType.id);


                    fetch_room = await getRoomById(room.id);

                    console.log({
                        roomPicture,
                        fetch_room,
                        f_rp: fetch_room.room_pictures,
                        f_rt: fetch_room.room_type,
                    });


                    await deleteARoomPicture(roomPicture.id);
                    await deleteRoom(room.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }
            }
        )


    }

)
