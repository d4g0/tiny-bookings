import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import {
    createRoomAmenity,
    createRoomType,
    deleteRoomAmenity,
    deleteRoomTypeByType,
    getRoomAmenity,
    getRoomTypeByTpe,
    getRoomTypes,
    updateRoomAmenity,
    updateRoomType
} from "dao/RoomDao";
import { v4 as uuid } from 'uuid';

describe(
    'Room Dao',

    function roomDaoTest() {

        var roomTypeData = {
            roomType: uuid().substring(0, 10)
        }

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
                    console.log({ roomTypes });
                    // clean
                    await deleteRoomTypeByType(roomType.room_type);
                    await deleteRoomTypeByType(roomType2.room_type);

                } catch (error) {
                    await deleteRoomTypeByType(roomType.room_type);
                    await deleteRoomTypeByType(roomType2.room_type);

                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(roomTypes.length).toBe(2);
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

        // create a room amenity
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



    }

)
