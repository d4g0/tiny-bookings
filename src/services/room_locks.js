/**
 *
 * Create room_lock_period
 *      non booking
 *      booking
 * Delete a room_lock_period
 * Get room_locks
 *
 *
 */

import { getRoomData } from 'dao/room/RoomDao';
import {
    createARoomLockPeriod as createARoomLockPeriodDao,
    deleteRoomLockPeriod as deleteRoomLockPeriodDao,
    getRoomLocks as getRoomLocksDao,
    getARoomIsLocks as getARoomIsLocksDao,
} from '~/dao/room/RoomLock';

export async function createARoomLockPeriod({
    room_id,
    reason = 'Default Reason', // default since it's optional
    start_date = { year, month, day, hour, minute },
    end_date = { year, month, day, hour, minute },
    hotel_calendar_length,
    is_a_booking = false,
    booking_id = null,
}) {
    return createARoomLockPeriodDao({
        room_id,
        reason,
        start_date,
        end_date,
        hotel_calendar_length,
        is_a_booking,
        booking_id,
    });
}

export async function deleteRoomLockPeriod(room_lock_period_id) {
    return deleteRoomLockPeriodDao(room_lock_period_id);
}

export async function getRoomLocks({
    start_date_filter,
    end_date_filter,
    page,
    hotel_id,
}) {
    return getRoomLocksDao({
        start_date_filter,
        end_date_filter,
        page,
        hotel_id,
    });
}

export async function getARoomIsLocks({
    start_date_filter = { year, month, day, hour, minute },
    end_date_filter = { year, month, day, hour, minute },
    page = 1, // 1 start based count
    room_id_filter,
}) {
    return getARoomIsLocksDao({
        start_date_filter,
        end_date_filter,
        page,
        room_id_filter,
    });
}

export async function createANoBookingRoomLock({
    room_id,
    reason = 'Default Reason', // default since it's optional
    start_date = new Date().toISOString(),
    end_date = new Date().toISOString(),
}) {
    try {
        const roomLock = await createARoomLockPeriod({
            room_id,
            reason,
            start_date,
            end_date,
            // inject as no booking defaults
            is_a_booking: false,
            booking_id: null,
        });

        const room = await getRoomData(room_id);

        roomLock.room = room;

        return roomLock;
    } catch (error) {
        throw error;
    }
}
