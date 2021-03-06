import { MAXIMUN_HOTEL_CALENDAR_LENGHT, USER_ROLES } from 'dao/DBConstans';
import {
    createAdminService,
    getAdminsService,
    deleteAdminById,
    getAdminByEmailPassword,
} from 'services/users/admin';
import xss from 'xss';
import { authenticated, authorized } from './auth';
import {
    getHotelById,
    createHotel,
    updateHotelName,
    updateHotelFreeCalendarDays,
    updateHotelDaysToCancel,
    updateHotelCheckInTime,
    updateHotelCheckOutTime,
    updateHotelTimeZone,
    getHotels,
    deleteHotelById,
} from 'services/hotel';
import {
    createRoom,
    createRoomAmenity,
    createRoomType,
    deleteRoom,
    deleteRoomAmenity,
    deleteRoomType,
    getRoomAmenities,
    getRoomAmenity,
    getRoomType,
    getRoomTypes,
    updateRoomAmenity,
    updateRoomName,
    updateRoomType,
    updateARoomIsType,
    updateRoomNightPrice,
    updateRoomCapacity,
    updateRoomNumberOfBeds,
    getRoomById,
    getRooms,
    createARoomIsAmenity,
    deleteARoomIsAmenity,
} from 'services/room';
import {
    createANoBookingRoomLock,
    createARoomLockPeriod,
    deleteANoBookingRoomLock,
    getARoomIsLocks,
    getRoomLocks,
} from 'services/room_locks';
import { getPaymentTypes } from 'dao/payments/PaymentTypeDao';
import { getBookingStates } from 'dao/booking/BookingStateDao';
import { getCurrencies } from 'dao/currencies/CurrencyDao';
import { getPayments } from 'dao/payments/PaymentsDao';
import { cancelBookingAsAdmin, createABookingAsAdmin } from 'services/bookings';
import { getBookingById, getBookings, getBookingsByClient } from 'dao/booking/BookingDao';
import { getClientByEmailPassword, singUp as singUpClient } from 'services/users/clients';
import { AuthenticationError } from 'apollo-server-core';
import { getClientById, getClients as getClientsService } from 'dao/users/ClientDao';
import { getRoomsAvailableIn } from 'dao/room/RoomDao';
import { getUserRoles } from 'dao/users/UserRoleDao';
import { updateARoomIsAmenities } from 'dao/room/RoomAmenitiesDao';
import { deleteARoomPicture } from 'dao/room/RoomPicturesDao.js';
import { getAllRoomLocksIn, getRoomLockById } from 'dao/room/RoomLock';

export const resolvers = {
    Query: {
        async loginAsAdmin(root, args, ctx) {
            var Auth = {
                admin: null,
                token: null,
                token_created_at: null,
            };

            var { email, password } = args.input;
            try {
                var admin = await getAdminByEmailPassword(email, password);
                // if we are here we have a user

                Auth.admin = admin;

                var token = ctx.createUserToken({
                    id: admin.id,
                    user_role: admin.user_role,
                });

                Auth.token = token;
                Auth.token_created_at = new Date().toISOString();

                return Auth;
            } catch (error) {
                throw error;
            }
        },

        async loginAsClient(root, args, ctx) {
            var Auth = {
                client: null,
                token: null,
                token_created_at: null,
            };

            var { email, password } = args.input;
            try {
                var client = await getClientByEmailPassword(email, password);
                // if we are here we have a user

                Auth.client = client;

                var token = ctx.createUserToken({
                    id: client.id,
                    user_role: client.user_role,
                });

                Auth.token = token;
                Auth.token_created_at = new Date().toISOString();

                return Auth;
            } catch (error) {
                throw error;
            }
        },

        // ---------------
        // Admin
        // ---------------
        admins: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx, info) => {
                var admins = await getAdminsService();
                if (admins) {
                    // filter current admin from results
                    var adminsMinusCurrentAdmin = admins.filter(
                        (admin) => admin.id != ctx.user.id
                    );
                    return adminsMinusCurrentAdmin;
                }
                return null;
            })
        ),

        // ---------------
        // User Roles
        // ---------------
        getUserRoles: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx, info) => {
                var userRoles = await getUserRoles();
                return userRoles;
            })
        ),

        // ---------------
        // Hotel
        // ---------------
        hotel: async (root, args, ctx, info) => {
            // hotel
            var { id } = args;

            try {
                var hotel = await getHotelById(id);
                return hotel;
            } catch (error) {
                // console.log(error)
                throw error;
            }
        },

        hotels: async (root, args, ctx, info) => {
            try {
                var hotels = await getHotels();
                return hotels;
            } catch (error) {
                // console.log(error)
                throw error;
            }
        },

        // ---------------
        // Room
        // ---------------
        // roomType
        getRoomType: async (root, args, ctx) => {
            var { room_type } = args.input;
            try {
                var roomType = await getRoomType(room_type);
                return roomType;
            } catch (error) {
                throw error;
            }
        },
        getRoomTypes: async (root, args, ctx) => {
            try {
                var roomTypes = await getRoomTypes();
                return roomTypes;
            } catch (error) {
                throw error;
            }
        },

        // roomAmenity
        getRoomAmenity: async (root, args, ctx) => {
            var { amenity } = args.input;
            try {
                var roomAmenity = await getRoomAmenity(amenity);
                return roomAmenity;
            } catch (error) {
                throw error;
            }
        },

        getRoomAmenities: async (root, args, ctx) => {
            try {
                var roomAmenities = await getRoomAmenities();
                return roomAmenities;
            } catch (error) {
                throw error;
            }
        },

        room: async (root, args, ctx) => {
            try {
                var { room_id } = args;
                var room = await getRoomById(room_id);
                return room;
            } catch (error) {
                throw error;
            }
        },

        rooms: async (root, args, ctx) => {
            try {
                var { hotel_id_filter } = args;
                var rooms = await getRooms(hotel_id_filter);
                return rooms;
            } catch (error) {
                throw error;
            }
        },

        // room locks
        roomLock: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { id } = args;
                    try {
                        var roomLock = await getRoomLockById(id);

                        return roomLock;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        getRoomLocks: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { start_date_filter, end_date_filter, page, hotel_id } =
                        args.input;
                    try {
                        var result = await getRoomLocks({
                            start_date_filter,
                            end_date_filter,
                            page,
                            hotel_id,
                        });

                        return result;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        getAllRoomLocks: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { start_date_filter, end_date_filter, hotel_id } = args.input;
                    try {
                        var result = await getAllRoomLocksIn({
                            start_date_filter,
                            end_date_filter,
                            hotel_id,
                        });

                        return result;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        getARoomIsLocks: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { start_date_filter, end_date_filter, page, room_id_filter } =
                        args.input;
                    try {
                        var result = await getARoomIsLocks({
                            start_date_filter,
                            end_date_filter,
                            page,
                            room_id_filter,
                        });

                        return result;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // ---------------
        // Payment Types
        // ---------------

        getPaymentTypes: async (root, args, ctx) => {
            try {
                var pts = await getPaymentTypes();
                return pts;
            } catch (error) {
                throw error;
            }
        },

        getBookingStates: async (root, args, ctx) => {
            try {
                var bs = await getBookingStates();
                return bs;
            } catch (error) {
                throw error;
            }
        },

        getCurrencies: async (root, args, ctx) => {
            try {
                var currencies = await getCurrencies();
                return currencies;
            } catch (error) {
                throw error;
            }
        },

        getClientPayments: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { start_date_filter, end_date_filter, page, hotel_id } =
                        args.input;

                    try {
                        var result = await getPayments({
                            start_date_filter,
                            end_date_filter,
                            page,
                            hotel_id,
                        });
                        return result;
                    } catch (error) {
                        throw error;
                    }

                    return createdAdmin;
                }
            )
        ),

        // get bookings
        getBooking: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { id } = args;
                    try {
                        var booking = getBookingById(id);
                        return booking;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        getBookings: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { start_date_filter, end_date_filter, page, hotel_id } =
                        args.input;
                    try {
                        var { results, count } = await getBookings({
                            start_date_filter,
                            end_date_filter,
                            page,
                            hotel_id,
                        });

                        return {
                            results,
                            count,
                        };
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        getClientBookingsAsClient: authenticated(
            authorized([USER_ROLES.CLIENT.user_role], async (root, args, ctx) => {
                var { start_date_filter, end_date_filter, page } = args.input;
                try {
                    var { results, count } = await getBookingsByClient({
                        start_date_filter,
                        end_date_filter,
                        page,
                        client_id: ctx.user.id,
                    });

                    return {
                        results,
                        count,
                    };
                } catch (error) {
                    throw error;
                }
            })
        ),

        getClientForAdmin: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { id } = args;
                    try {
                        var client = await getClientById(id);
                        return client;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        getClients: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { start_date_filter, end_date_filter, page } = args.input;
                    try {
                        var result = await getClientsService({
                            start_date_filter,
                            end_date_filter,
                            page,
                        });
                        return result;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // get rooms available
        getRoomsAvailable: async (root, args, ctx) => {
            var { hotel_id, start_date, end_date } = args.input;
            try {
                var result = await getRoomsAvailableIn({
                    hotel_id,
                    hotel_calendar_length: MAXIMUN_HOTEL_CALENDAR_LENGHT,
                    start_date,
                    end_date,
                });
                return result;
            } catch (error) {
                throw error;
            }
        },
    },

    Mutation: {
        // ---------------
        // Admin
        // ---------------
        createAdmin: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                const { user_role_id, email, admin_name, admin_description, password } =
                    args.input;

                // sanitation non covered values will be
                // extrictly validated in down procesing layers
                var s_email = xss(email).trim();
                var s_admin_name = xss(admin_name.toLocaleLowerCase().trim());
                var s_admin_description = xss(admin_description).trim();

                var createdAdmin;

                try {
                    createdAdmin = await createAdminService({
                        creator_admin_id: ctx.user.id,
                        user_role_id,
                        email: s_email,
                        admin_name: s_admin_name,
                        admin_description: s_admin_description,
                        password,
                    });
                } catch (error) {
                    throw error;
                }

                return createdAdmin;
            })
        ),

        deleteAdmin: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var id = args.id;
                var { completed, count } = await deleteAdminById(id);
                return { completed, count };
            })
        ),

        // ---------------
        // Hotel
        // ---------------
        createHotel: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var {
                    hotel_name,
                    maximun_free_calendar_days,
                    check_in_hour_time,
                    check_out_hour_time,
                    minimal_prev_days_to_cancel,
                    iana_time_zone,
                } = args.input;

                // sanitation
                var s_hotel_name = xss(hotel_name);

                try {
                    var hotelData = {
                        hotel_name: s_hotel_name,
                        maximun_free_calendar_days,
                        check_in_hour_time: check_in_hour_time,
                        check_out_hour_time: check_out_hour_time,
                        minimal_prev_days_to_cancel,
                        iana_time_zone,
                    };

                    var hotel = await createHotel({
                        admin_id: ctx.user.id,
                        ...hotelData,
                    });
                    // console.log({ admin_id: ctx.user.id, hotelData, hotel })

                    return hotel;
                } catch (error) {
                    throw error;
                }
            })
        ),

        updateHotelName: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { hotel_id, hotel_name } = args.input;
                console.log({ args });
                try {
                    // sanitation
                    var s_hotel_name = xss(hotel_name);
                    var hotel = await updateHotelName(hotel_id, s_hotel_name);
                    return hotel;
                } catch (error) {
                    throw error;
                }
            })
        ),

        updateHotelFreeCalendarDays: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { hotel_id, maximun_free_calendar_days } = args.input;
                try {
                    // sanitation
                    var hotel = await updateHotelFreeCalendarDays(
                        hotel_id,
                        maximun_free_calendar_days
                    );
                    return hotel;
                } catch (error) {
                    throw error;
                }
            })
        ),

        updateHotelDaysToCancel: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { hotel_id, minimal_prev_days_to_cancel } = args.input;
                try {
                    var hotel = await updateHotelDaysToCancel(
                        hotel_id,
                        minimal_prev_days_to_cancel
                    );
                    return hotel;
                } catch (error) {
                    throw error;
                }
            })
        ),

        updateHotelCheckIn: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { hotel_id, check_in_hour_time } = args.input;
                try {
                    var hotel = await updateHotelCheckInTime(
                        hotel_id,
                        check_in_hour_time
                    );
                    return hotel;
                } catch (error) {
                    throw error;
                }
            })
        ),

        updateHotelCheckOut: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { hotel_id, check_out_hour_time } = args.input;
                try {
                    var hotel = await updateHotelCheckOutTime(
                        hotel_id,
                        check_out_hour_time
                    );
                    return hotel;
                } catch (error) {
                    throw error;
                }
            })
        ),

        updateHotelTimeZone: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { hotel_id, iana_time_zone } = args.input;
                try {
                    var hotel = await updateHotelTimeZone(hotel_id, iana_time_zone);
                    return hotel;
                } catch (error) {
                    throw error;
                }
            })
        ),

        delHotel: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var id = args.id;
                var hotel = await deleteHotelById(id);
                return hotel;
            })
        ),

        // ---------------
        // Room
        // ---------------
        // roomType
        createRoomType: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_type } = args.input;
                    // sanitation
                    var s_room_type = xss(room_type);
                    try {
                        var roomType = await createRoomType(s_room_type);
                        return roomType;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        deleteRoomType: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_type } = args.input;

                    try {
                        var roomType = await deleteRoomType(room_type);
                        return roomType;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        updateRoomType: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_type, new_room_type } = args.input;
                    // sanitation (room_type was sanitaced in createRoomType())
                    var new_room_type = xss(new_room_type);
                    try {
                        var roomType = await updateRoomType(room_type, new_room_type);
                        return roomType;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // roomAmenity
        createRoomAmenity: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { amenity } = args.input;
                    // sanitation
                    var s_amenity = xss(amenity);
                    try {
                        var roomAmenity = await createRoomAmenity(s_amenity);
                        return roomAmenity;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        updateRoomAmenity: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { amenity, new_amenity } = args.input;
                    // sanitation (amenity was sanitaced in createRoomAmenity())
                    var s_new_amenity = xss(new_amenity);
                    try {
                        var roomAmenity = await updateRoomAmenity(amenity, s_new_amenity);
                        return roomAmenity;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        deleteRoomAmenity: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { amenity } = args.input;
                    // sanitation (amenity was sanitaced in createRoomAmenity())
                    try {
                        var roomAmenity = await deleteRoomAmenity(amenity);
                        return roomAmenity;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        deleteRoomPicture: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_picture_id } = args.input;

                    var s_room_picture_id = xss(room_picture_id);
                    s_room_picture_id = parseInt(s_room_picture_id);

                    try {
                        var roomPicture = await deleteARoomPicture(s_room_picture_id);
                        return roomPicture;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // room
        createRoom: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { hotel_id, room_name, night_price, capacity, number_of_beds } =
                    args.input;
                // sanitation
                var s_room_name = xss(room_name);
                try {
                    var room = await createRoom({
                        hotel_id,
                        room_name: s_room_name,
                        night_price,
                        capacity,
                        number_of_beds,
                    });
                    return room;
                } catch (error) {
                    throw error;
                }
            })
        ),

        deleteRoom: authenticated(
            authorized(USER_ROLES.FULL_ADMIN.user_role, async (root, args, ctx) => {
                var { room_id } = args.input;
                // sanitation
                try {
                    var delResult = await deleteRoom(room_id);
                    return delResult;
                } catch (error) {
                    throw error;
                }
            })
        ),

        updateRoomName: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, room_name } = args.input;
                    // sanitation (amenity was sanitaced in createRoomAmenity())
                    var s_room_name = xss(room_name);
                    try {
                        var room = await updateRoomName(room_id, s_room_name);
                        return room;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        updateARoomIsType: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, room_type_id } = args.input;
                    try {
                        var room = await updateARoomIsType(room_id, room_type_id);
                        return room;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        updateRoomNightPrice: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, new_night_price } = args.input;
                    try {
                        var room = await updateRoomNightPrice(room_id, new_night_price);
                        return room;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        updateRoomCapacity: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, new_capacity } = args.input;
                    try {
                        var room = await updateRoomCapacity(room_id, new_capacity);
                        return room;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        updateRoomNumberOfBeds: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, new_number_of_beds } = args.input;
                    try {
                        var room = await updateRoomNumberOfBeds(
                            room_id,
                            new_number_of_beds
                        );
                        return room;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // deps
        // amenities
        createARoomIsAmenity: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, amenity_id } = args.input;
                    try {
                        var roomIsAmenity = await createARoomIsAmenity(
                            room_id,
                            amenity_id
                        );
                        return roomIsAmenity;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        deleteARoomIsAmenity: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, amenity_id } = args.input;
                    try {
                        var delCount = await deleteARoomIsAmenity(room_id, amenity_id);
                        return delCount;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // updateARoomIsAmenities
        updateARoomIsAmenities: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, amenities_ids } = args.input;
                    try {
                        var room = await updateARoomIsAmenities(room_id, amenities_ids);
                        return room;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // room lock period
        createARoomLockPeriod: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { room_id, reason, start_date, end_date } = args.input;
                    try {
                        var s_reason = null;
                        if (reason) {
                            s_reason = xss(s_reason);
                        }

                        var roomLock = await createANoBookingRoomLock({
                            room_id,
                            reason,
                            start_date,
                            end_date,
                        });

                        return roomLock;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        deleteARoomLockPeriod: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { id } = args;
                    try {
                        var res = await deleteANoBookingRoomLock(id);
                        return res;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),

        // ---------------
        // Bookings
        // ---------------
        // create booking as admin
        createBookingAsAdmin: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var {
                        start_date,
                        end_date,
                        rooms_ids,
                        hotel_id,
                        client_name,
                        client_last_name,
                        total_price,
                        payment_type_id,
                        currency_id,
                        number_of_guests,
                    } = args.input;
                    try {
                        // sanitation
                        var s_client_name = xss(client_name);
                        var s_client_last_name = xss(client_last_name);

                        var { completed, error, results } = await createABookingAsAdmin({
                            start_date,
                            end_date,
                            rooms_ids,
                            hotel_id,
                            hotel_calendar_length: MAXIMUN_HOTEL_CALENDAR_LENGHT,
                            client_name: s_client_name,
                            client_last_name: s_client_last_name,
                            total_price,
                            payment_type_id,
                            currency_id,
                            number_of_guests,
                        });

                        if (!completed) {
                            throw error;
                        }

                        var booking = results.booking;

                        return booking;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),
        // cancel booking
        cancelBooking: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var { bookingId } = args;
                    try {
                        var { completed, results, error } = await cancelBookingAsAdmin(
                            bookingId
                        );
                        if (!completed) {
                            throw error;
                        }

                        var canceledBooking = results.booking;
                        return canceledBooking;
                    } catch (error) {
                        throw error;
                    }
                }
            )
        ),
        // singUp
        singUp: async (root, args, ctx) => {
            var Auth = {
                client: null,
                token: null,
                token_created_at: null,
            };

            var { client_name, client_last_name, password, email } = args.input;

            var s_client_name = xss(client_name);
            var s_client_last_name = xss(client_last_name);
            var s_email = xss(email);

            try {
                var isCaptchaClear = await ctx.isCaptchaClear(ctx.req);

                if (!isCaptchaClear) {
                    throw new AuthenticationError('Should provide a valid captcha');
                }
                var client = await singUpClient({
                    client_name: s_client_name,
                    client_last_name: s_client_last_name,
                    email: s_email,
                    password,
                });

                var token = ctx.createUserToken({
                    id: client.id,
                    user_role: client.user_role,
                });

                var now = new Date().toISOString();

                Auth.client = client;
                Auth.token = token;
                Auth.token_created_at = now;

                return Auth;
            } catch (error) {
                throw error;
            }
        },
    },
};
