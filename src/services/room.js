import {
    createRoomType as createRoomTypeDao,
    deleteRoomTypeByType,
    getRoomTypeByTpe,
    getRoomTypes as getRoomTypesDao,
    updateRoomType as updateRoomTypeDao,
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