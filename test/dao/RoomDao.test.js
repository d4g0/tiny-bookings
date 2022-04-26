import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createHotel, deleteHotelById } from "dao/HotelDao";
import { v4 as uuid } from 'uuid';
import { mapTimeToDateTime, randStr } from 'dao/utils';
import { createRoom, deleteRoom, getRoomById, getRoomData, getRoomDataRaw, getRoomsData, updateARoomIsType, updateRoomCapacity, updateRoomName, updateRoomNightPrice, updateRoomNumberOfBeds } from "dao/room/RoomDao";
import { createRoomType, deleteRoomTypeByType, updateRoomType } from "dao/room/RoomTypesDao";
import { createARoomPicture, deleteARoomPicture } from "dao/room/RoomPicturesDao";
import { createARoomIsAmenity, createRoomAmenity, deleteARoomIsAmenity, deleteRoomAmenity } from "dao/room/RoomAmenitiesDao";
describe(
    'Room Dao',

    function () {

        var customHotel;
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



            } catch (error) {
                console.log(error);
            }
        })

        afterAll(async () => {
            try {
                // Pending Clean TODO
                // make sure there is not dependent room at this point ok
                // clean created hotel
                // await deleteHotelById(customHotel.id); // delete depending room first TODO
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


        // create a no deps room and delete it
        test(
            "Create and delete room (simple room. no deps)",
            async function () {
                var dbError = null, room = null, del_result = null;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    console.log({ room });

                    del_result = await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                // //
                // Create tests
                // //
                // spec check when created 
                // some fields are null or empty arrays
                expect(room.id).toBeDefined();
                expect(room.hotel_id).toBeDefined();
                expect(room.room_name).toBeDefined();
                expect(room.night_price).toBeDefined();
                expect(room.capacity).toBeDefined();
                expect(room.number_of_beds).toBeDefined();
                expect(room.created_at).toBeDefined();
                expect(room.room_type_id).toBeNull();
                expect(room.room_type_key).toBeNull();
                expect(room.room_pictures).toStrictEqual([]);
                expect(room.room_amenities).toStrictEqual([]);
                // //
                // Delete tests
                // //
                expect(del_result.count).toBe(1);
                expect(del_result.completed).toBe(true);

            }
        )


        // create a room with full deps  and delete it
        test(
            "Create and delete room (with deps)",
            async function () {
                var dbError = null, room = null, del_result = null;
                var roomType = null, roomIsType = null,
                    roomPic = null, roomAmenity = null,
                    roomIsAmenity = null, f_room = null;


                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    // room type
                    roomType = await createRoomType(randStr());
                    roomIsType = await updateARoomIsType(room.id, roomType.id);

                    // room amenities
                    roomAmenity = await createRoomAmenity(randStr());
                    roomIsAmenity = await createARoomIsAmenity(room.id, roomAmenity.id);

                    // room pictures
                    roomPic = await createARoomPicture(room.id, randStr() + '.jpg');

                    f_room = await getRoomData(room.id);

                    console.log({
                        f_room
                    });
                    del_result = await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                // //
                // Create tests
                // //
                // spec check when created 
                // some fields are null or empty arrays
                expect(f_room.id).toBeDefined();
                expect(f_room.hotel_id).toBeDefined();
                expect(f_room.room_name).toBeDefined();
                expect(f_room.night_price).toBeDefined();
                expect(f_room.capacity).toBeDefined();
                expect(f_room.number_of_beds).toBeDefined();
                expect(f_room.created_at).toBeDefined();
                // deps checks
                // room type
                expect(f_room.room_type_id).toBe(roomType.id);
                expect(f_room.room_type_key).toBe(roomType.room_type);
                // room pics
                expect(f_room.room_pictures[0].room_picture_id).toBe(roomPic.id);
                expect(f_room.room_pictures[0].filename).toBe(roomPic.filename);
                // room amenities
                expect(f_room.room_amenities[0].amenity_id).toBe(roomAmenity.id);
                expect(f_room.room_amenities[0].amenity).toBe(roomAmenity.amenity);

                // //
                // Delete tests
                // //
                expect(del_result.count).toBe(1);
                expect(del_result.completed).toBe(true);

            }
        )


        // roomName
        test(
            "Updates",
            async function () {
                var dbError = null, room = null, NEW_NAME = randStr(),
                    roomType = null, u_room = null, NEW_PRICE = 210.55;
                var NEW_CAPACITY = 4, NEW_BEDS = 2;
                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    });

                    // room type
                    roomType = await createRoomType(randStr());
                    await updateARoomIsType(room.id, roomType.id);


                    // room name
                    await updateRoomName(room.id, NEW_NAME);

                    // night price
                    await updateRoomNightPrice(room.id, NEW_PRICE);

                    // capacity
                    await updateRoomCapacity(room.id, NEW_CAPACITY);

                    // beds
                    await updateRoomNumberOfBeds(room.id, NEW_BEDS);

                    u_room = await getRoomData(room.id);
                    console.log({ roomType, u_room });
                    // clean
                    await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                // room type
                expect(u_room.room_type_id).toBe(roomType.id);
                expect(u_room.room_type_key).toBe(roomType.room_type);
                // room name
                expect(u_room.room_name).toBe(NEW_NAME);
                // night price
                expect(u_room.night_price).toBe(NEW_PRICE);
                // capacity
                expect(u_room.capacity).toBe(NEW_CAPACITY);
                // beds
                expect(u_room.number_of_beds).toBe(NEW_BEDS);


            }
        )

        // update a room is type
        // test(
        //     "Update a Room is Type",
        //     async function () {

        //         var dbError = null, room = null, roomType = null, ROOM_TYPE_KEY = uuid().substring(0, 10);

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: roomData.night_price,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             })

        //             // create a room_type to use it
        //             roomType = await createRoomType(ROOM_TYPE_KEY);
        //             // console.log({ roomType })
        //             // update
        //             var u_room = await updateARoomIsType(room.id, roomType.id);

        //             // console.log({ u_room })

        //             // clean
        //             await deleteRoom(room.id);
        //             await deleteRoomTypeByType(roomType.room_type)
        //         } catch (error) {
        //             console.log(error)
        //             dbError = error;
        //         }

        //         expect(dbError).toBe(null);
        //         expect(room.id).toBeDefined()
        //         expect(u_room.room_type).toBe(roomType.id);
        //         expect(u_room.room_types.room_type).toBe(ROOM_TYPE_KEY);

        //     }
        // )

        // updateRoomNightPrice
        // test(
        //     "Update a room night price",
        //     async function () {
        //         var dbError = null, room = null, u_room = null, NEW_NIGHT_PRICE = 20.79;

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: 13.50,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             });

        //             u_room = await updateRoomNightPrice(room.id, NEW_NIGHT_PRICE);

        //             // console.log({ u_room });

        //             await deleteRoom(room.id);

        //         } catch (error) {
        //             dbError = error;
        //             console.log(error);
        //         }
        //         expect(dbError).toBeNull();
        //         expect(+u_room.night_price).toBe(NEW_NIGHT_PRICE);
        //     }
        // )

        // updateRoomCapacity
        // test(
        //     "Update a room capacity",
        //     async function () {
        //         var dbError = null, room = null, uc_room = null, NEW_CAPACITY = 40;

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: 13.50,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             });

        //             // console.log({
        //             //     'ntofb': typeof room.number_of_beds
        //             // })
        //             uc_room = await updateRoomCapacity(room.id, NEW_CAPACITY);

        //             // console.log({ uc_room });

        //             await deleteRoom(room.id);

        //         } catch (error) {
        //             dbError = error;
        //             console.log(error);
        //         }
        //         expect(dbError).toBeNull();
        //         expect(uc_room.capacity).toBe(NEW_CAPACITY);
        //     }
        // )

        // updateRoomNumberOfBeds
        // test(
        //     "Update a room number_of_beds",
        //     async function () {
        //         var dbError = null, room = null, u_room = null, NEW_NUMBER_OF_BEDS = 4;

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: 13.50,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             });

        //             // console.log({
        //             //     'ntofb': typeof room.number_of_beds
        //             // })
        //             u_room = await updateRoomNumberOfBeds(room.id, NEW_NUMBER_OF_BEDS);

        //             // console.log({ u_room });

        //             await deleteRoom(room.id);

        //         } catch (error) {
        //             dbError = error;
        //             console.log(error);
        //         }
        //         expect(dbError).toBeNull();
        //         expect(u_room.number_of_beds).toBe(NEW_NUMBER_OF_BEDS);
        //     }
        // )



        // total room spec coverage 
        // test(
        //     "Create a room with amenities, type, pictures",
        //     async function () {

        //         var dbError = null,
        //             room = null,
        //             roomType = null,
        //             ROOM_TYPE_KEY = uuid().substring(0, 10),
        //             amenity = null,
        //             secondAmenity = null,
        //             AMENITY_KEY = uuid().substring(0, 10),
        //             SECOND_AMENITY_KEY = uuid().substring(0, 10),
        //             roomPicture = null, FILE_NAME = 'supper-foo-picture',
        //             final_room = null,
        //             roomIsAmenity = null,
        //             secondRoomIsAmenity = null,
        //             simpleRoom = null,
        //             f_simpleRoomRaw = null
        //             ;

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: roomData.night_price,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             })

        //             simpleRoom = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: uuid().substring(0, 10),
        //                 night_price: roomData.night_price,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             })

        //             // create a room_type to use it
        //             roomType = await createRoomType(ROOM_TYPE_KEY);
        //             // update with the type
        //             await updateARoomIsType(room.id, roomType.id);
        //             // amenity
        //             amenity = await createRoomAmenity(AMENITY_KEY);
        //             secondAmenity = await createRoomAmenity(SECOND_AMENITY_KEY);
        //             roomIsAmenity = await createARoomIsAmenity(room.id, amenity.id);
        //             secondRoomIsAmenity = await createARoomIsAmenity(room.id, secondAmenity.id);

        //             console.log({ roomIsAmenity, secondRoomIsAmenity })
        //             // pictures
        //             roomPicture = await createARoomPicture(room.id, FILE_NAME);

        //             final_room = await getRoomData(room.id);
        //             f_simpleRoomRaw = await getRoomDataRaw(simpleRoom.id);

        //             // final_room = await getRoomById(room.id);
        //             // final_room = roomsData[0];

        //             console.log({
        //                 final_room,
        //                 final_room_1_amenity: final_room.room_amenities[0],
        //                 final_room_2_amenity: final_room.room_amenities[1],
        //                 final_room_1_picture: final_room.room_pictures[0],
        //                 f_simpleRoomRaw: f_simpleRoomRaw

        //             })
        //             // clean
        //             // await deleteARoomIsAmenity(roomIsAmenity.room_id, roomIsAmenity.amenity_id);
        //             // await deleteARoomIsAmenity(secondRoomIsAmenity.room_id, secondRoomIsAmenity.amenity_id);
        //             // // amenities
        //             // await deleteRoomAmenity(final_room.rooms_amenities[0].room_amenity.amenity);
        //             // await deleteRoomAmenity(final_room.rooms_amenities[1].room_amenity.amenity);
        //             // await deleteARoomPicture(roomPicture.id);
        //             // await deleteRoom(room.id);
        //             // await deleteRoomTypeByType(roomType.room_type)
        //         } catch (error) {
        //             console.log(error)
        //             dbError = error;
        //         }

        //         expect(dbError).toBe(null);
        //         // ALL CHEKS

        //         // simples
        //         expect(final_room.id).toBeDefined();
        //         expect(final_room.hotel_id).toBeDefined();
        //         expect(final_room.room_name).toBeDefined();
        //         expect(final_room.night_price).toBeDefined();
        //         expect(final_room.capacity).toBeDefined();
        //         expect(final_room.number_of_beds).toBeDefined();
        //         expect(final_room.created_at).toBeDefined();
        //         // type
        //         // expect(final_room.room_type).toBe(roomType.id);
        //         // expect(final_room.room_types.id).toBe(roomType.id);
        //         // expect(final_room.room_types.room_type).toBe(roomType.room_type);
        //         // pictures
        //         // expect(final_room.room_pictures[0]).toBeDefined();
        //         // expect(final_room.room_pictures[0].id).toBe(roomPicture.id);
        //         // expect(final_room.room_pictures[0].room_id).toBe(roomPicture.room_id);
        //         // expect(final_room.room_pictures[0].filename).toBe(roomPicture.filename);
        //         // amenities
        //         // amenity
        //         // roomAmenity
        //         // expect(final_room.rooms_amenities[0]).toBeDefined();
        //         // expect(final_room.rooms_amenities[0].amenity_id).toBe(roomIsAmenity.amenity_id);
        //         // expect(final_room.rooms_amenities[0].room_id).toBe(roomIsAmenity.room_id);
        //         // expect(final_room.rooms_amenities[0].room_amenity.id).toBe(amenity.id);
        //         // expect(final_room.rooms_amenities[0].room_amenity.amenity).toBe(amenity.amenity);
        //     }
        // )

        // get rooms data
        // test(
        //     "Get Rooms Data",
        //     async function () {
        //         var dbError = null,
        //             roomsData = null;

        //         try {
        //             roomsData = await getRoomsData();

        //             console.log({ roomsData })
        //         } catch (error) {
        //             dbError = error;
        //             console.log(error);
        //         }

        //         expect(dbError).toBeNull();
        //     }
        // )

    }

)
