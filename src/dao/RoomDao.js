import { prisma } from 'dao/PrismaClient.js';
import { DB_UNIQUE_CONSTRAINT_ERROR, NOT_FOUND_RECORD_ERROR } from './Errors';
import { isValidRoomType } from './utils';


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
        throw new Error('Non Valid [roomType] argument')
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
            var customError = new NOT_FOUND_RECORD_ERROR('Admin not found');
            throw customError;
        }
        throw error;
    }
}


/**
 * Retrives an admin user  from db 
 * based in is user id since it's a 
 * `UNIQUE` constrained field (PK)
 * 
 * Throws dbErrors:
 * 
 * If admin does not exists returns `null`
 * 
 * 
 * 
 * @param {String} roomType 
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
 * @returns 
 */
export async function getRoomTypes() {

    try {
        var admins = await prisma.room_types.findMany();
        return admins;
    } catch (error) {
        throw error;
    }

}