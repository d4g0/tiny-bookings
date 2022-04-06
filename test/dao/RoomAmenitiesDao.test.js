import { 
    createRoomAmenity, 
    deleteRoomAmenity, 
    getRoomAmenity, 
    updateRoomAmenity 
} from 'dao/room/RoomAmenitiesDao';
import { v4 as uuid } from 'uuid'


describe(
    'Room Amenities Dao',

    function roomAmenitiesDaoTest() {


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



    }

)