import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createRoomType, deleteRoomTypeByType, getRoomTypeByTpe, getRoomTypes, updateRoomType } from "dao/room/RoomTypesDao";
import { v4 as uuid } from 'uuid'
var roomTypeData = {
    roomType: uuid().substring(0, 10)
}

describe(
    'Room Types Dao',

    function roomTypesDaoTest() {
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


        // get a room type  by type
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
                var ROOM_TYPE = uuid().substring(10);
                var NEW_ROOM_TYPE = uuid().substring(10);
                try {
                    roomType = await createRoomType(ROOM_TYPE);
                    u_roomType = await updateRoomType(ROOM_TYPE, NEW_ROOM_TYPE);
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
    })