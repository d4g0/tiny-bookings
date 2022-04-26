/**
 * Room CRUD Operations
 */

import { DB_UNIQUE_CONSTRAINT_ERROR, FORGEIN_KEY_ERROR, NOT_FOUND_RECORD_ERROR } from "dao/Errors";
import { prisma } from 'db/PrismaClient.js';
import { isValidId, isValidInteger, isValidPositiveInteger, isValidPrice, isValidRoomName } from "dao/utils";
import { getAmenitiesByRoom } from "./RoomAmenitiesDao";
import sql from "db/postgres";


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

        var roomRes = await sql`
            with i_room as 
            (
                insert into
                    room (
                        hotel_id,
                        room_name,
                        night_price,
                        capacity,
                        number_of_beds
                    )
                values
                    (
                        ${hotel_id},
                        ${room_name},
                        ${night_price},
                        ${capacity},
                        ${number_of_beds}
                    ) 
                returning 
                    room.id
            ) 
            select 
                rm.* 
            from  i_room ir 
            join get_room_data(ir.id) rm on (ir.id = rm.id);
        `;

        var room = mapRawRoomDataToRoom(roomRes[0]);
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


        // clean dependencies
        // rooms_amenities
        await sql`
            delete from rooms_amenities rams 
            where rams.room_id = ${room_id}
        `;
        // room pictures 
        await sql`
            delete from room_pictures rmp 
            where rmp.room_id = ${room_id}
        `;


        // finaly no dependencies, not forgein key errors
        // delete the room
        var delRes = await sql`
            delete from room rm where rm.id = ${room_id}  returning *
        `

        var count = delRes.length;
        var completed = true;

        return {
            count,
            completed
        }

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


        var updateRes = await sql`
            with u_room as 
            (
                update room 
                set room_type = ${room_type_id}
                where room.id = ${room_id}
                returning  room.id
                    
            ) 
            select 
                rm.* 
            from  u_room ur 
            join get_room_data(ur.id) rm on (ur.id = rm.id)
        `;

        var room = updateRes.length ? mapRawRoomDataToRoom(updateRes[0]) : null;

        return room;

    } catch (error) {

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


        var updateRes = await sql`
            with u_room as 
            (
                update room 
                set room_name = ${room_name}
                where room.id = ${room_id}
                returning  room.id
                    
            ) 
            select 
                rm.* 
            from  u_room ur 
            join get_room_data(ur.id) rm on (ur.id = rm.id)
        `;

        var room = updateRes.length ? mapRawRoomDataToRoom(updateRes[0]) : null;

        return room;


    } catch (error) {
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


        var updateRes = await sql`
            with u_room as 
            (
                update room 
                set night_price = ${new_night_price}
                where room.id = ${room_id}
                returning  room.id
                    
            ) 
            select 
                rm.* 
            from  u_room ur 
            join get_room_data(ur.id) rm on (ur.id = rm.id)
        `;

        var room = updateRes.length ? mapRawRoomDataToRoom(updateRes[0]) : null;

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
        room.created_at = room.created_at.toISOString();
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
        room.created_at = room.created_at.toISOString();
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
        room.created_at = room.created_at.toISOString();
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


export async function getRoomsData() {
    try {
        var roomsData = await sql`
        select
            rm.id,
            rm.hotel_id,
            rm.room_name,
            rm.night_price,
            rm.capacity,
            rm.number_of_beds,
            rm.created_at,
            rm.room_type as room_type_id,
        -- room type
            ( 
                select rt.room_type from room_types rt
                where rt.id = rm.room_type
            ) as room_type_key,
        -- 	room pictures
            ARRAY(
                select 
                    rp.id || ' ' || rp.filename
                from room_pictures rp
                where rp.room_id = rm.id
            ) as room_pictures,
        -- 	room amenities
            ARRAY(
                select 
                ra.id || ' ' || ra.amenity
                from room_amenity ra join rooms_amenities rams
                on ra.id = rams.amenity_id
                where rams.room_id = rm.id
            ) as room_amenities
        from room rm 
        order by rm.id
        `;

        return roomsData;
    } catch (error) {
        throw error;
    }
}


export async function getRoomData(room_id) {
    if (!isValidId(room_id)) {
        throw new Error('Non valid room id')
    }
    try {
        var roomDataRes = await sql`
        select * from get_room_data(${room_id});
        `;
        var room = roomDataRes.length > 0 ? mapRawRoomDataToRoom(roomDataRes[0]) : null;

        return room;
    } catch (error) {
        throw error;
    }
}

function mapRawRoomDataToRoom({
    id,
    hotel_id,
    room_name,
    night_price,
    capacity,
    number_of_beds,
    created_at,
    room_type_id,
    room_type_key,
    room_pictures,
    room_amenities,
}) {

    var m_room_pics = room_pictures.map((line) => {
        var lineParts = line.split(' ');
        return {
            room_picture_id: +lineParts[0],
            filename: lineParts[1],
        }
    });

    var m_room_amenities = room_amenities.map((line) => {
        var lineParts = line.split(' ');
        return {
            amenity_id: +lineParts[0],
            amenity: lineParts[1],
        }
    });
    return {
        id,
        hotel_id,
        room_name,
        night_price: +night_price,
        capacity,
        number_of_beds,
        created_at,
        room_type_id,
        room_type_key,
        room_pictures: m_room_pics,
        room_amenities: m_room_amenities,
    }
}


// test only
export async function getRoomDataRaw(room_id) {
    if (!isValidId(room_id)) {
        throw new Error('Non valid room id')
    }
    try {
        var roomDataRes = await sql`
            select * from get_room_data(${room_id});
        `;
        var room = roomDataRes.length > 0 ? roomDataRes[0] : null;

        return room;
    } catch (error) {
        throw error;
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