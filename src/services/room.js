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
import {
    createARoomPicture as createARoomPictureDao,
    deleteARoomPicture as deleteARoomPictureDao
} from '~/dao/room/RoomPicturesDao'
// room
import {
    createRoom as createRoomDao,
    deleteRoom as deleteRoomDao,
    updateRoomName as updateRoomNameDao,
    updateARoomIsType as updateARoomIsTypeDao,
    updateRoomNightPrice as updateRoomNightPriceDao,
    updateRoomCapacity as updateRoomCapacityDao,
    updateRoomNumberOfBeds as updateRoomNumberOfBedsDao,
    getRoomData,
    getRoomsData,
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
export async function createARoomPicture(room_id){
    return createARoomPictureDao(filename)
}

export async function deleteARoomPicture(room_picture_id){
    return deleteARoomPictureDao(room_picture_id)
}


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
    return getRoomData(room_id);
}

export async function getRooms(hotel_id_filter) {
    return getRoomsData(hotel_id_filter)
}
