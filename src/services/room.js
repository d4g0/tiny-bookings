// room types
import {
    createRoomType as createRoomTypeDao,
    deleteRoomTypeByType,
    getRoomTypeByTpe,
    getRoomTypes as getRoomTypesDao,
    updateRoomType as updateRoomTypeDao,
} from 'dao/room/RoomTypesDao'

// room amenities
import {
    createRoomAmenity as createRoomAmenityDao,
    getRoomAmenity as getRoomAmenityDao,
    updateRoomAmenity as updateRoomAmenityDao,
    deleteRoomAmenity as deleteRoomAmenityDao,
    getRoomAmenities as getRoomAmenitiesDao,
    createARoomIsAmenity as createARoomIsAmenityDao,
    deleteARoomIsAmenity as deleteARoomIsAmenityDao,
} from '~/dao/room/RoomAmenitiesDao'
// room pictures

// room
import {
    createRoom as createRoomDao,
    deleteRoom as deleteRoomDao,
    updateRoomName as updateRoomNameDao,
    updateARoomIsType as updateARoomIsTypeDao,
    updateRoomNightPrice as updateRoomNightPriceDao,
    updateRoomCapacity as updateRoomCapacityDao,
    updateRoomNumberOfBeds as updateRoomNumberOfBedsDao,
    getRoomById as getRoomByIdDao,
    getRooms as getRoomsDao,
} from '~/dao/room/RoomDao'

// ---------------
// Room Types 
// ---------------
export async function createRoomType(room_type) {
    return createRoomTypeDao(room_type);
}

export async function deleteRoomType(room_type) {
    return deleteRoomTypeByType(room_type);
}

export async function getRoomType(room_type) {
    return getRoomTypeByTpe(room_type);
}

export async function getRoomTypes() {
    return getRoomTypesDao();
}

export async function updateRoomType(room_type, new_room_type) {
    return updateRoomTypeDao(room_type, new_room_type);
}



// ---------------
// Room Amenities 
// ---------------
export async function createRoomAmenity(amenity) {
    return createRoomAmenityDao(amenity);
}
export async function getRoomAmenity(amenity) {
    return getRoomAmenityDao(amenity);
}
export async function updateRoomAmenity(amenity, new_amenity) {
    return updateRoomAmenityDao(amenity, new_amenity);
}
export async function deleteRoomAmenity(amenity) {
    return deleteRoomAmenityDao(amenity);
}

export async function getRoomAmenities() {
    return getRoomAmenitiesDao()
}

export function createARoomIsAmenity(room_id, amenity_id) {
    return createARoomIsAmenityDao(room_id, amenity_id);
}
export function deleteARoomIsAmenity(room_id, amenity_id) {
    return deleteARoomIsAmenityDao(room_id, amenity_id);
}

// ---------------
// Room Pictures 
// ---------------



// ---------------
// Room 
// ---------------

export async function createRoom({
    hotel_id,       // Int reference to a Hotel id
    room_name,      // String
    night_price,    // Int
    capacity,       // Int
    number_of_beds, // Int
}) {
    return createRoomDao({
        hotel_id,
        room_name,
        night_price,
        capacity,
        number_of_beds,
    });
}

export async function deleteRoom(room_id) {
    return deleteRoomDao(room_id);
}

export async function updateRoomName(room_id, room_name) {
    return updateRoomNameDao(room_id, room_name);
}

export async function updateARoomIsType(room_id, room_type_id) {
    return updateARoomIsTypeDao(room_id, room_type_id);
}

export async function updateRoomNightPrice(room_id, new_night_price) {
    return updateRoomNightPriceDao(room_id, new_night_price);
}

export async function updateRoomCapacity(room_id, new_capacity) {
    return updateRoomCapacityDao(room_id, new_capacity);
}

export async function updateRoomNumberOfBeds(room_id, new_number_of_beds) {
    return updateRoomNumberOfBedsDao(room_id, new_number_of_beds);
}

export async function getRoomById(room_id) {
    return getRoomByIdDao(room_id);
}

export async function getRooms() {
    return getRoomsDao()
}


// export async function createARoomIsAmenity(room_id, amenity_id){
//     return createARoomIsAmenityDao(room_id, amenity_id)
// }
// export async function deleteARoomIsAmenity(room_is_amenity_id){
//     return deleteARoomIsAmenityDao(room_is_amenity_id)
// }
// getRooms TODO


/**
 * Returns true if the providedd room
 * it's free in the specified date interval
 * False other wise
 * Throws dbErrors
 */
 export async function isNotBussyRoom({
    room_id,
    start_date,
    end_date
}) {

    // validate
    if (!isValid(room_id)) {
        throw new Error('Non valid room_id: ' + room_id);
    }
    if (!isValidDateObject(start_date)) {
        throw new Error('Non valid start_date Date Obj');
    }
    if (!isValidDateObject(end_date)) {
        throw new Error('Non valid end_date Date Obj');
    }

    var room_with_bookings_locks = await prisma.room.findUnique({
        where: {
            id: room_id,
        },
        include: {
            room_lock_period: {
                where:{
                    start_date : {
                    
                    }
                }
            },
            rooms_bookings: true
        }
    })
}