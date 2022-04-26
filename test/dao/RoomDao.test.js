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


        // updates
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



        // get rooms data
        test(
            "Get Rooms Data",
            async function () {
                var dbError = null,
                    roomsData = null;
                var s_room = null;
                var f_room = null;
                var roomType, roomIsType, roomAmenity, roomIsAmenity, roomPic;
                var r_s_room = null, r_f_room = null;

                try {

                    // create a simple room (no deps)
                    s_room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: randStr(),
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })



                    // create a full room
                    f_room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: randStr(),
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })
                    // add deps
                    roomType = await createRoomType(randStr());
                    roomIsType = await updateARoomIsType(f_room.id, roomType.id);

                    // room amenities
                    roomAmenity = await createRoomAmenity(randStr());
                    roomIsAmenity = await createARoomIsAmenity(f_room.id, roomAmenity.id);

                    // room pictures
                    roomPic = await createARoomPicture(f_room.id, randStr() + '.jpg');


                    roomsData = await getRoomsData(customHotel.id);
                    // the rooms are sorted by id
                    // so this test creation order will be respected
                    // and since not other room it will be created will 
                    // this test rooms the next secuence has to get the 
                    // created rooms 
                    // get last - 1
                    r_s_room = roomsData[roomsData.length - 2]
                    // get last
                    r_f_room = roomsData[roomsData.length - 1]

                    console.log({
                        // roomsData, 
                        // s_room,
                        // f_room,
                        // r_s_room,
                        // r_f_room_rp: r_f_room.room_pictures
                    })
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBeNull();
                // roomData assertions
                expect(Array.isArray(roomsData)).toBe(true);
                // check for matching records
                expect(s_room.id).toBe(r_s_room.id);
                expect(f_room.id).toBe(r_f_room.id);
                // simple room assertions
                expect(r_s_room.id).toBeDefined();
                expect(r_s_room.hotel_id).toBeDefined();
                expect(r_s_room.room_name).toBeDefined();
                expect(r_s_room.night_price).toBeDefined();
                expect(r_s_room.capacity).toBeDefined();
                expect(r_s_room.number_of_beds).toBeDefined();
                expect(r_s_room.created_at).toBeDefined();
                expect(r_s_room.room_type_id).toBeNull();
                expect(r_s_room.room_type_key).toBeNull();
                expect(r_s_room.room_pictures).toStrictEqual([]);
                expect(r_s_room.room_amenities).toStrictEqual([]);
                // full room deps assertions
                expect(r_f_room.id).toBeDefined();
                expect(r_f_room.hotel_id).toBeDefined();
                expect(r_f_room.room_name).toBeDefined();
                expect(r_f_room.night_price).toBeDefined();
                expect(r_f_room.capacity).toBeDefined();
                expect(r_f_room.number_of_beds).toBeDefined();
                expect(r_f_room.created_at).toBeDefined();
                // deps checks
                // room type
                expect(r_f_room.room_type_id).toBe(roomType.id);
                expect(r_f_room.room_type_key).toBe(roomType.room_type);
                // room pics
                expect(r_f_room.room_pictures[0].room_picture_id).toBe(roomPic.id);
                expect(r_f_room.room_pictures[0].filename).toBe(roomPic.filename);
                // room amenities
                expect(r_f_room.room_amenities[0].amenity_id).toBe(roomAmenity.id);
                expect(r_f_room.room_amenities[0].amenity).toBe(roomAmenity.amenity);
            }
        )

    }

)
