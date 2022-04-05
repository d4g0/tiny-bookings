import {
    createRoomType as createRoomTypeDao,
    deleteRoomTypeByType,
    getRoomTypeByTpe,
    getRoomTypes as getRoomTypesDao,
    updateRoomType as updateRoomTypeDao,
    createRoomAmenity as createRoomAmenityDao,
    getRoomAmenity as getRoomAmenityDao,
    updateRoomAmenity as updateRoomAmenityDao,
    deleteRoomAmenity as deleteRoomAmenityDao,
    getRoomAmenities as getRoomAmenitiesDao
} from '~/dao/RoomDao'

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

export async function getRoomAmenities(){
    return getRoomAmenitiesDao()
}