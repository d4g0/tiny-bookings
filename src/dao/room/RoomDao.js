/**
 * Room CRUD Operations
 */

import { DB_UNIQUE_CONSTRAINT_ERROR, FORGEIN_KEY_ERROR, NOT_FOUND_RECORD_ERROR } from "dao/Errors";
import { prisma } from 'dao/PrismaClient.js';
import { isValidId, isValidInteger, isValidPositiveInteger, isValidPrice, isValidRoomName } from "dao/utils";
import { getAmenitiesByRoom } from "./RoomAmenitiesDao";


export async function createRoom({
    hotel_id,       // Int reference to a Hotel id
    room_name,      // String
    night_price,    // Int
    capacity,       // Int
    number_of_beds, // Int
}) {

    // validation
    if (!isValidId(hotel_id)) {
        throw new Error('Non Valid Id')
    }

    if (!isValidRoomName(room_name)) {
        throw new Error('Non Valid Room Name: ' + room_name)
    }
    if (!isValidPrice(night_price)) {
        throw new Error('Non Valid Night Price')
    }
    if (!(isValidInteger(capacity) && capacity > 0)) {
        throw new Error('Non Valid Capacity')
    }
    if (!(isValidInteger(number_of_beds) && number_of_beds > 0)) {
        throw new Error('Non Valid Number Of Beds')
    }

    try {

        var room = await prisma.room.create({
            data: {
                hotel_id,
                room_name,
                night_price,
                capacity,
                number_of_beds,
            },
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }
        })

        return room;

    } catch (error) {
        if (error.code == 'P2002') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Unique constraint error', error?.meta?.target[0]);
        }
        throw error
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
 * Update a room it's name
 * @param {number} room_id 
 * @param {string} room_name 
 */
export async function updateRoomName(room_id, room_name) {

    // validate
    if (!isValidId(room_id)) {
        throw new Error('Non valid [room_id]');
    }
    if (!isValidRoomName(room_name)) {
        throw new Error('Non valid [room_name]');
    }

    try {


        var room = await prisma.room.update({
            where: {
                id: room_id
            },
            data: {
                room_name
            },
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }
        })

        return room;

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
 * Update a room it's `room_type`
 * @param {number} room_id 
 * @param {string} room_name 
 */
export async function updateARoomIsType(room_id, room_type_id) {
    // validate
    if (!isValidId(room_id)) {
        throw new Error('Non valid [room_id]');
    }
    if (!isValidId(room_type_id)) {
        throw new Error('Non valid [room_type_id]');
    }

    try {


        var room = await prisma.room.update({
            where: {
                id: room_id
            },
            data: {
                room_type: room_type_id
            },
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }
        })


        return room;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[room] not found');
            throw customError;
        }
        throw error;
    }
}



export async function updateRoomNightPrice(room_id, new_night_price) {
    // validate
    if (!isValidId(room_id)) {
        throw new Error('Non valid [room_id]');
    }

    if (!isValidPrice(new_night_price)) {
        throw new Error('Non valid [room_id]');
    }

    try {
        var room = await prisma.room.update({
            where: {
                id: room_id
            },
            data: {
                night_price: new_night_price
            },
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }
        })

        return room;
    } catch (error) {
        throw error;
    }
}

export async function updateRoomCapacity(room_id, new_capacity) {
    if (!isValidId(room_id)) {
        throw new Error('Non valid [room_id]');
    }
    if (!(isValidPositiveInteger(new_capacity) && new_capacity > 0)) {
        throw new Error('Non Valid new_capacity');
    }

    try {
        var room = await prisma.room.update({
            where: {
                id: room_id
            },
            data: {
                capacity: new_capacity
            },
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }
        })
        return room
    } catch (error) {
        throw error;
    }
}

export async function updateRoomNumberOfBeds(room_id, new_number_of_beds) {

    if (!isValidId(room_id)) {
        throw new Error('Non Valid room_id')
    }
    if (!(isValidInteger(new_number_of_beds) && new_number_of_beds > 0)) {
        throw new Error('Non Valid Number Of Beds')
    }

    try {
        var room = await prisma.room.update({
            where: {
                id: room_id
            },
            data: {
                number_of_beds: new_number_of_beds
            },
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }
        })

        return room
    } catch (error) {
        throw error;
    }
}



export async function getRoomById(room_id) {

    if (!isValidId(room_id)) {
        throw new Error('Non Valid room_id');
    }

    // fetch the room
    try {

        var room = await prisma.room.findUnique({
            where: {
                id: room_id
            },
            // room spec pack
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }

        });

        return room;

    } catch (error) {
        throw error
    }
}


export async function getRooms() {

    try {
        var rooms = await prisma.room.findMany({
            include: {
                room_pictures: true,
                room_types: true,
                rooms_amenities: {
                    include: {
                        room_amenity: true
                    }
                }
            }
        });
        

        return rooms;

    } catch (error) {
        console.log(error);
        throw error
    }
}


/**
 Room Spec Completion Pack for read and update with prisma
include: {
    room_pictures: true,
    room_types: true,
    rooms_amenities: {
        include: {
            room_amenity: true
        }
    }
}
*/