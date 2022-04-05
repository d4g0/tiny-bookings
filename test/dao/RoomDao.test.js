import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import {
    createHotel,

} from "dao/HotelDao";
import { createRoomType, deleteRoomTypeByType, getRoomTypeByTpe } from "dao/RoomDao";
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
            "Create a room type",
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



    }

)
