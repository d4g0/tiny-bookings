/**
 * Room CRUD Operations
 */

import { DB_UNIQUE_CONSTRAINT_ERROR, FORGEIN_KEY_ERROR, NOT_FOUND_RECORD_ERROR } from "dao/Errors";
import { prisma } from 'dao/PrismaClient.js';
import { isValidId, isValidInteger, isValidRoomName, mapRoomResToRoom } from "dao/utils";


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
    if (!isValidInteger(night_price)) {
        throw new Error('Non Valid Night Price')
    }
    if (!isValidInteger(capacity)) {
        throw new Error('Non Valid Capacity')
    }
    if (!isValidInteger(number_of_beds)) {
        throw new Error('Non Valid Number Of Beds')
    }

    try {

        var roomRes = await prisma.room.create({
            data: {
                hotel_id,
                room_name,
                night_price,
                capacity,
                number_of_beds,
            }
        })

        // return roomRes;
        var specRoom = mapRoomResToRoom({
            id: roomRes.id,
            hotel_id: roomRes.hotel_id,
            room_name: roomRes.room_name,
            night_price: roomRes.night_price,
            capacity: roomRes.capacity,
            number_of_beds: roomRes.number_of_beds,
            room_type: roomRes.room_type,
            created_at: roomRes.created_at,
        })
        return specRoom;

    } catch (error) {
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