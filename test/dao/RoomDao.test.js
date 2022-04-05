import {
    createHotel,

} from "dao/HotelDao";
import { createRoomType, deleteRoomTypeByType } from "dao/RoomDao";

import { v4 as uuid } from 'uuid';

describe(
    'Hotel Dao',

    function hoetlDaoTest() {

        var roomTypeData = {
            roomType: 'Matrimonial'
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
