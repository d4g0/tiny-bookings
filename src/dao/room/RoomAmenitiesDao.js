import { DB_UNIQUE_CONSTRAINT_ERROR, FORGEIN_KEY_ERROR, NOT_FOUND_RECORD_ERROR } from "dao/Errors";
import { isValidId, isValidRoomAmenity } from "dao/utils";
import { prisma } from 'dao/PrismaClient.js';



export async function createRoomAmenity(amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }

    try {

        const RoomAmenity = await prisma.room_amenity.create({
            data: {
                amenity
            }
        })
        return RoomAmenity;

    } catch (error) {
        if (error?.code == 'P2002') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Unable to create [room_amenity] as unique constrain fails')
        }
        throw error
    }
}


/**
 * Retrives a room_amenity  from db 
 * based in is `amenity` 
 * 
 * Throws dbErrors, Not Found errors
 * 
 * 
 * @param {String} amenity 
 */
export async function getRoomAmenity(amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }

    try {
        // query for user with user_role
        var roomAmenity = await prisma.room_amenity.findUnique({
            where: {
                amenity
            }
        })

        // handle not found case
        if (!roomAmenity) {
            throw new NOT_FOUND_RECORD_ERROR('No [room_amenity] Found');
        }

        return roomAmenity;
    }
    catch (error) {
        throw error
    }
}


/**
 * Retrives a room_amenity  from db 
 * based in is `amenity` 
 * Returns `null` if amenity was not found
 * Throws dbErrors, 
 * 
 * 
 * @param {String} amenity 
 */
export async function getRoomAmenityWithOutThrowing(amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }

    try {
        // query for user with user_role
        var roomAmenity = await prisma.room_amenity.findUnique({
            where: {
                amenity
            }
        })
        return roomAmenity;
    }
    catch (error) {
        throw error
    }
}


/**
 * Returns all the `room_amenities` in db
 * @returns {Promise<[RoomAmenity]>} 
 */
export async function getRoomAmenities() {

    try {
        var amenities = await prisma.room_amenity.findMany();
        return amenities;
    } catch (error) {
        throw error;
    }

}


export async function updateRoomAmenity(amenity, new_amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }
    if (!isValidRoomAmenity(new_amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }

    try {
        // query for user with user_role
        var roomAmenity = await prisma.room_amenity.update({
            where: {
                amenity
            },
            data: {
                amenity: new_amenity
            }
        })

        // handle not found case
        if (!roomAmenity) {
            throw new NOT_FOUND_RECORD_ERROR('No [amenity] Found');
        }

        return roomAmenity;
    }
    catch (error) {
        throw error
    }
}


/**
 * Deletes a room_amenity
 * by his `amenity`
 * @param {String} amenity 
 */
export async function deleteRoomAmenity(amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }


    try {

        var delRes = await prisma.room_amenity.delete({
            where: {
                amenity
            },
        })

        return delRes;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[amenity] not found');
            throw customError;
        }

        if (error.code == 'P2003') {
            var customError = new FORGEIN_KEY_ERROR('Forgein Key Error');
            throw customError;
        }
        throw error;
    }
}

/**
 * Fetch or Create amenities and return his `ids`
 * *Internal Use only*.
 * Asumes `amenities_strs` arg has been validated.
 * @param {RoomAmenity.amenity[]} amenities_strs 
 */
export async function mapAmenitiesToIds(amenities_strs) {
    var amenities_ids = [];

    try {

        for (let i = 0; i < amenities._strslength; i++) {
            // fetch amenity
            var currentAmenity = await getRoomAmenityWithOutThrowing(amenities_strs[i]);
            // keep id if found
            if (currentAmenity) {
                amenities_ids.push(currentAmenity.id)
            }
            // amenity dosen't exists lets create one and save his id
            else {
                currentAmenity = await createRoomAmenity(amenities_strs[i]);
                amenities_ids.push(currentAmenity.id);
            }

        }
        // return acumulated amenities ids
        return amenities_ids;
    } catch (error) {
        throw error
    }
}

/**
 * Return an array of `room_amenities`
 * amenities strings based in the provided ids
 * @param {number[]} amenities_ids 
 * @returns 
 */
export async function getAmenitiesByIds(amenities_ids) {
    if (!Array.isArray(amenities_ids)) {
        throw new Error('Non Valid Amenities Ids')
    }
    if (!areValidIds(amenities_ids)) {
        throw new Error('Non valid amenities_ids')
    }

    try {
        var amenities = [];
        for (let i = 0; i < amenities_ids.length; i++) {
            var currentAmenity = await prisma.room_amenity.findFirst({
                where: {
                    id: amenities_ids[i]
                }
            })
            amenities.push(currentAmenity.amenity);
        }

        return amenities;

    } catch (error) {
        throw error;
    }
}



export async function getAmenitiesByRoom(room_id) {
    if (!isValidId(room_id)) {
        throw new Error('Non Valid [room_id]');
    }


    try {
        // fetch rooms_amenities
        var rooms_amenities = await prisma.rooms_amenities.findMany({
            where: {
                room_id
            }
        })
        // map to amenities_ids
        var amenities_ids = rooms_amenities.map(a => a.amenity_id);
        // map to amenities strings
        var amenities = await getAmenitiesByIds(amenities_ids);

        return amenities;

    } catch (error) {
        throw error
    }
}