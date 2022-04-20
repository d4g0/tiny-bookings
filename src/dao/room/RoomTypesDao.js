import { DB_UNIQUE_CONSTRAINT_ERROR, NOT_FOUND_RECORD_ERROR } from 'dao/Errors';
import { prisma } from 'db/PrismaClient.js';
import { isValidRoomType } from 'dao/utils';




/**
 * Create a room Type
 * Returns the created Room Type
 * Throws:
 *   dbErrors, 
 *   Unique Constrain error
 *   Non Valid Input error
 * @param {String} type
 */
export async function createRoomType(room_type) {

    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [roomType] argument')
    }

    try {

        const RoomType = await prisma.room_types.create({
            data: {
                room_type
            }
        })
        return RoomType;

    } catch (error) {
        if (error?.code == 'P2002') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Unable to create [roomType] as unique constrain fails')
        }
        throw error
    }

}


/**
 * Deletes a roomType user from db
 * filtered by his roomType Key
 * @param {String} adminName 
 */
export async function deleteRoomTypeByType(room_type) {
    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [roomType] argument: ' + room_type)
    }


    try {

        var delRes = await prisma.room_types.delete({
            where: {
                room_type
            },
        })

        return delRes;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[room_type] not found');
            throw customError;
        }
        throw error;
    }
}


/**
 * Retrives a room type  from db 
 * based in is `room_type` 
 * 
 * Throws dbErrors, Not Found errors
 * 
 * 
 * @param {String} room_type 
 */
export async function getRoomTypeByTpe(room_type) {
    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [roomType] argument')
    }

    try {
        // query for user with user_role
        var roomType = await prisma.room_types.findUnique({
            where: {
                room_type
            }
        })

        // handle not found case
        if (!roomType) {
            throw new NOT_FOUND_RECORD_ERROR('No roomType Found');
        }

        return roomType;
    }
    catch (error) {
        throw error
    }
}


/**
 * Returns all the room types
 * @returns {Promise<[RoomType]>} 
 */
export async function getRoomTypes() {

    try {
        var roomTypes = await prisma.room_types.findMany();
        return roomTypes;
    } catch (error) {
        throw error;
    }

}

export async function updateRoomType(room_type, new_room_type) {
    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [room_type] argument')
    }
    if (!isValidRoomType(new_room_type)) {
        throw new Error('Non Valid [room_type] argument')
    }

    try {
        // query for user with user_role
        var roomType = await prisma.room_types.update({
            where: {
                room_type
            },
            data: {
                room_type: new_room_type
            }
        })

        return roomType;
    }
    catch (error) {
        // handle not found case
        if (error.code == 'P2025') {
            throw new NOT_FOUND_RECORD_ERROR('No [room_type] Found');
        }
        throw error
    }
}
