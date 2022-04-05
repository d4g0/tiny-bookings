import {
    createHotel,

} from "dao/HotelDao";
import { createRoomType, deleteRoomTypeByType } from "dao/RoomDao";
import { v4 as uuid } from 'uuid';

describe(
    'Room Dao',

    function roomDaoTest() {

        var roomTypeData = {
            roomType: uuid().substring(0, 10)
        }


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



    }

)
