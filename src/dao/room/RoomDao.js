/**
 * Room CRUD Operations
 */

import { DB_UNIQUE_CONSTRAINT_ERROR, FORGEIN_KEY_ERROR, NOT_FOUND_RECORD_ERROR } from "dao/Errors";
import { prisma } from 'dao/PrismaClient.js';
import { isValidId, isValidInteger, isValidRoomName } from "dao/utils";


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

        return roomRes;

    } catch (error) {
        throw error
    }

}