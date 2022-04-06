import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createHotel, deleteHotelById } from "dao/HotelDao";
import {
    createRoom,
    createRoomAmenity,
    createRoomType,
    deleteRoom,
    deleteRoomAmenity,
    deleteRoomTypeByType,
    getRoomAmenity,
    getRoomTypeByTpe,
    getRoomTypes,
    updateRoomAmenity,
    updateRoomType
} from "dao/RoomDao";
import { v4 as uuid } from 'uuid';
import { mapTimeToDateTime } from 'dao/utils';
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
                // await deleteRoomTypeByType(customRoomType.room_type);
                // clean created hotel
                // await deleteHotelById(customHotel.id);
            } catch (error) {
                console.log(error);
            }
        })

        var roomTypeData = {
            roomType: uuid().substring(0, 10)
        }

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

        // create a room type
        test(
            "Create a room type",
            async function () {

                var dbError = null, roomType = null;

                try {
                    roomType = await createRoomType(roomTypeData.roomType);
                    console.log({ roomType });
                    // clean
                    await deleteRoomTypeByType(roomTypeData.roomType);
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null)

            }
        )

        // check create with same roomType error
        test(
            "Create 2 roomTypes with same type error",
            async function () {

                var dbError = null, roomType = null, fooRoom = null;

                try {
                    roomType = await createRoomType(roomTypeData.roomType);
                    fooRoom = await createRoomType(roomTypeData.roomType);
                    console.log({ roomType });
                    // clean
                    await deleteRoomTypeByType(roomTypeData.roomType);
                } catch (error) {
                    await deleteRoomTypeByType(roomTypeData.roomType);
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBeDefined()
                expect(dbError.code).toBe(DB_UNIQUE_CONSTRAINT_ERROR_KEY);
            }
        )


        // get a room by type
        test(
            "Get a roomType by type",
            async function () {

                var dbError = null, roomType = null, retrievedRoomType = null;

                try {
                    roomType = await createRoomType(roomTypeData.roomType);
                    retrievedRoomType = await getRoomTypeByTpe(roomType.room_type);

                    console.log({ retrievedRoomType });
                    // clean
                    await deleteRoomTypeByType(roomTypeData.roomType);
                } catch (error) {
                    await deleteRoomTypeByType(roomTypeData.roomType);
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(roomType.id).toBe(retrievedRoomType.id);
                expect(roomType.room_type).toBe(retrievedRoomType.room_type);

            }
        )

        // get roomTypes getRoomTypes
        test(
            "Get RoomTypes",
            async function () {

                var dbError = null, roomType = null, roomType2 = null, roomTypes = null;

                try {
                    roomType = await createRoomType(uuid().substring(0, 10));
                    roomType2 = await createRoomType(uuid().substring(0, 10));
                    roomTypes = await getRoomTypes();
                    // console.log({ roomTypes });
                    // clean
                    await deleteRoomTypeByType(roomType.room_type);
                    await deleteRoomTypeByType(roomType2.room_type);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(roomTypes.length).toBeGreaterThanOrEqual(2); // you might have other roomTypes in db ok
            }
        )

        // update roomType
        test(
            "Update a roomType",
            async function () {
                var dbError = null, roomType = null, u_roomType = null;
                var NEW_ROOM_TYPE = uuid().substring(10);
                try {
                    roomType = await createRoomType(roomTypeData.roomType);
                    u_roomType = await updateRoomType(roomType.room_type, NEW_ROOM_TYPE);
                    console.log({ u_roomType });
                    // clean
                    await deleteRoomTypeByType(u_roomType.room_type);
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(roomType.id).toBe(u_roomType.id);
            }
        )

        // Create, read, delete and update a room amenity
        test(
            "Create, read, delete and update a room amenity",
            async function () {
                var dbError = null,
                    amenity = null,
                    r_amenity = null,
                    u_amenity = null,
                    d_amenity = null,
                    idMatch = false
                    ;

                const AMENITY = uuid().substring(10);
                const NEW_AMENITY = uuid().substring(10);
                try {

                    // create
                    amenity = await createRoomAmenity(AMENITY);
                    // read
                    r_amenity = await getRoomAmenity(AMENITY);
                    // update
                    u_amenity = await updateRoomAmenity(AMENITY, NEW_AMENITY);
                    // delete
                    d_amenity = await deleteRoomAmenity(NEW_AMENITY);

                    idMatch = (
                        amenity.id == r_amenity.id &&
                        r_amenity.id == u_amenity.id &&
                        u_amenity.id == d_amenity.id
                    )

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }
                expect(dbError).toBe(null);
                expect(idMatch).toBe(true);
            }
        )


        test(
            "Create and delete a Room with amenities",
            async function () {
                var dbError = null, room = null;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_type: customRoomType.id,
                        ...roomData,
                        amenities: gloablAmenities
                    });

                    console.log({ room })

                    // await deleteRoom(room.id);
                } catch (error) {
                    dbError = error;
                    console.log(error)
                }

                expect(dbError).toBeNull();
                expect(room.id).toBeGreaterThanOrEqual(0);
            }
        )

    }

)
