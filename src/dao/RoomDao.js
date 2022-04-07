import { prisma } from 'dao/PrismaClient.js';
import { DB_UNIQUE_CONSTRAINT_ERROR, FORGEIN_KEY_ERROR, NOT_FOUND_RECORD_ERROR } from './Errors';
import { isValidId, isValidInteger, isValidRoomAmenity, isValidRoomType, isValidRoomName, mapRoomResToRoom, areValidAmenities } from './utils';








// ---------------
// Room Amenities 
// ---------------




// ---------------
// Room Pictures 
// ---------------
// pending till rom completion since it's depending on those

// ---------------
// Rooms *ON THIS*
// ---------------
//  
/**
 * Creates a room.
 * If amenities: `[room_amenity]` are provided
 * it will check if those existis, if not, it will 
 * create those, then it will create the 
 * respective `rooms_amenities` units of the 
 * many to many relation bettewn `room` and `room_amenity`
 * @returns 
 */
export async function createRoom({
    hotel_id,       // Int reference to a Hotel id
    room_type,      // Int reference to RoomType id
    room_name,      // String
    night_price,    // Int
    capacity,       // Int
    number_of_beds, // Int
    amenities = [], // Array Of Amenity Strings
}) {

    // validation
    if (!isValidId(hotel_id)) {
        throw new Error('Non Valid Id')
    }
    if (!isValidId(room_type)) {
        throw new Error('Non Valid Id')
    }
    if (!isValidRoomName(room_name)) {
        throw new Error('Non Valid Room Name: ' + room_name)
    }
    if (!isValidInteger(night_price)) {
        throw new Error('Non Valid Night Price')
    }
    if (!isValidInteger(capacity)) {
        throw new Error('Non Valid Capacity')
    }
    if (!isValidInteger(number_of_beds)) {
        throw new Error('Non Valid Number Of Beds')
    }

    var amenities_ids = [];
    if (amenities.length) {
        if (!areValidAmenities(amenities)) {
            throw new Error('A non valid amenity was provided, amenities: ' + amenities);
        }
    }

    try {

        // handle amenities if any
        if (amenities.length) {
            // fetch or create amenities and get his `ids`
            amenities_ids = await mapAmenitiesToIds(amenities);
        }

        var room;

        // create the room first
        room = await prisma.room.create({
            data: {
                hotel_id,
                room_type,
                room_name,
                night_price,
                capacity,
                number_of_beds,
            },
            include: {
                room_types: true
            }
        });


        // create rooms_amenities units
        var rooms_amenities_units;
        if (amenities.length) {
            rooms_amenities_units = await createRoomsAmenities(amenities_ids, room);
        }


        /**
         Res Sample
            {
                room: {
                id: 1,
                hotel_id: 246,
                room_name: 'fdcfd999-8',
                night_price: 10,
                capacity: 2,
                number_of_beds: 1,
                room_type: 169,
                created_at: 2022-04-05T21:00:28.386Z,
                room_types: { id: 169, room_type: '1b5-4ebd-9248-78af1f73da50' }
                rooms_amenities: [ { id: 39, room_id: 37, amenity_id: 28 }  ]
                }
            }
        */

        var mapedRoom = mapRoomResToRoom({
            id: room.id,
            hotel_id: room.hotel_id,
            room_name: room.room_name,
            night_price: room.night_price,
            capacity: room.capacity,
            number_of_beds: room.number_of_beds,
            created_at: room.created_at,
            room_types: room.room_types,
            amenities,
        });
        return mapedRoom;

        // test only
        // return mapRoomResToRoom(c_room);

    } catch (error) {
        throw error;
    }
}

/**
 * Create `RoomsAmenities` Units
 * @param {Number[]} amenities_ids 
 */
async function createRoomsAmenities(amenities_ids, room) {
    var rooms_amenities = [];
    try {

        for (let i = 0; i < amenities_ids.length; i++) {
            var rooms_amenities_unit = await prisma.rooms_amenities.create({
                data: {
                    room_id: room.id,
                    amenity_id: amenities_ids[i]
                }
            })
            rooms_amenities.push(rooms_amenities_unit);
        }

        return rooms_amenities;
    } catch (error) {
        throw error;
    }
}


/**
 * Deletes a `room`
 * with all it's dependent 
 * `rooms_amenities` and `room_pictures`
 * records.
 * @param {number} room_id 
 * @returns 
 */
export async function deleteRoom(room_id) {

    // validation
    if (!isValidId(room_id)) {
        throw new Error('Non Valid Room Id')
    }

    try {

        // fetch room with  its  dependecies
        var room = await prisma.room.findFirst({
            where: {
                id: room_id
            },
            include: {
                rooms_amenities: true,
                room_pictures: true,
            }
        })

        // clean dependencies
        // rooms_amenities
        var roomsAmenities = room.rooms_amenities;
        await prisma.rooms_amenities.deleteMany({
            where: {
                room_id: room.id
            }
        })
        // room pictures
        var roomPictures = room.room_pictures;
        await prisma.room_pictures.deleteMany({
            where: {
                room_id: room.id
            }
        })


        // finaly no dependencies, not forgein key errors
        // delete the room
        var delRes = await prisma.room.delete({
            where: {
                id: room_id
            },
        })

        return delRes;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[room] not found');
            throw customError;
        }
        throw error;
    }

}

/**
 * Return an array of a `room_amenities`
 * strings corresponding to the ameneties 
 * of the provided room
 * @param {number} room_id 
 * @returns {RoomAmenity.amenity[]}
 */
export async function getARoomItsAmenities(room_id) {
    // validate
    if (!isValidId(room_id)) {
        throw new Error('Non Valid [room_id]');
    }

    try {
        // find room_amenities records of the many to many
        var rooms_amenities = await prisma.rooms_amenities.findMany({
            where: {
                room_id: room_id
            }
        })

        // extract the amenities ids
        var amenities_ids = rooms_amenities.map(ra => (ra.amenity_id));

        // get the actual amenities strings based on those ids
        var amenities = await getAmenitiesByIds(amenities_ids);

        return amenities;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[room] not found');
            throw customError;
        }
    }

}





/**
 * Update the `room_type` forgein key
 * of a room with the provided `new_room_type_id`
 * if it's a real `room_type` `id` in the `db`
 * @param {number} room_id 
 * @param {number} new_room_type_id 
 * @returns 
 */
export async function updateARoomIsType(room_id, new_room_type_id) {
    // validate
    if (!isValidId(room_id)) {
        throw new Error('Non Valid Room Id')
    }
    if (!isValidId(new_room_type_id)) {
        throw new Error('Non Valid [new_room_type_id] argument')
    }

    try {
        // perform the operation
        var room = await prisma.room.update({
            where: {
                id: room_id
            },
            data: {
                room_type: new_room_type_id
            },
            include: {
                room_types: true,
            }
        })

        // handle not found case
        if (!room) {
            throw new NOT_FOUND_RECORD_ERROR('No [room_type] Found');
        }

        var mapedRoom = mapRoomResToRoom(room);
        return mapedRoom;
    }
    catch (error) {
        throw error
    }
}













export async function updateRoomName(room_name) {

}

export async function updateRoomNightPrice(night_price) {

}

export async function updateRoomCapacity(capacity) {

}

export async function updateRoomBeds(number_of_beds) {

}


