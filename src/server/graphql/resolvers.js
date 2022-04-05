import { USER_ROLES } from "dao/DBConstans";
import { mapTimeToDateTime } from "dao/utils";
import {
    createAdminService,
    getAdminsService,
    getUserByEmailPassword,
    deleteAdminById
} from "services/users/admin";
import xss from "xss";
import { authenticated, authorized } from "./auth";
import {
    getHotelById,
    createHotel,
    updateHotelName,
    updateHotelFreeCalendarDays,
    updateHotelDaysToCancel,
    updateHotelCheckInTime,
    updateHotelCheckOutTime,
    updateHotelTimeZone
} from "services/hotel";
import { createRoomType, deleteRoomType } from "services/room";

export const resolvers = {

    // ---------------
    // Query 
    // ---------------
    Query: {

        // ---------------
        // Login 
        // ---------------
        async login(root, args, ctx) {

            var Auth = {
                user: null,
                token: null,
                token_created_at: null,
            }


            var { email, password } = args.input;
            try {


                var user = await getUserByEmailPassword(email, password);
                // getUserByEmailPassword throws if not found, so
                // if we are here we have a user

                Auth.user = user;

                var token = ctx.createAdminToken({
                    id: user.id,
                    user_role: user.user_role,
                    email: user.email,
                    admin_name: user.admin_name,
                    created_at: user.created_at,
                });

                Auth.token = token;
                Auth.token_created_at = new Date().toISOString();

                return Auth;
            } catch (error) {
                throw error
            }
        },

        // ---------------
        // Admin 
        // ---------------
        admins: authenticated(
            authorized(
                [
                    USER_ROLES.FULL_ADMIN.user_role,
                    USER_ROLES.BASIC_ADMIN.user_role
                ],
                async (root, args, ctx, info) => {
                    var admins = await getAdminsService();
                    if (admins) {

                        // filter current admin from results
                        var adminsMinusCurrentAdmin = admins.filter(admin => admin.id != ctx.user.id);
                        return adminsMinusCurrentAdmin;
                    }
                    return null
                }
            )
        ),

        // ---------------
        // Hotel 
        // ---------------
        hotel: async (root, args, ctx, info) => {
            // hotel
            var { id } = args.input;

            try {
                var hotel = await getHotelById(id);
                return hotel;
            } catch (error) {
                // console.log(error)
                throw error
            }
        },


    },
    // ---------------
    // Mutation 
    // ---------------
    Mutation: {


        // admin
        createAdmin: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    const {
                        user_role,
                        email,
                        admin_name,
                        admin_description,
                        password,
                    } = args.input;

                    // sanitation non covered values will be
                    // extrictly validated in down procesing layers
                    var s_email = xss(email).trim();
                    var s_admin_name = xss(admin_name.toLocaleLowerCase().trim());
                    var s_admin_description = xss(admin_description).trim();

                    var createdAdmin;

                    try {
                        createdAdmin = await createAdminService({
                            creator_admin_id: ctx.user.id,
                            user_role,
                            email: s_email,
                            admin_name: s_admin_name,
                            admin_description: s_admin_description,
                            password,
                        })

                    } catch (error) {
                        throw error
                    }


                    return createdAdmin;
                }
            )
        ),

        deleteAdmin: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var id = args.id;
                    var deletedAdmin = await deleteAdminById(id);
                    return deletedAdmin;
                }
            )
        ),



        // hotel
        createHotel: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var {
                        hotel_name,
                        maximun_free_calendar_days,
                        check_in_hour_time,
                        check_out_hour_time,
                        minimal_prev_days_to_cancel,
                        iana_time_zone
                    } = args.input;

                    // sanitation
                    var s_hotel_name = xss(hotel_name);

                    try {
                        var hotelData = {
                            hotel_name: s_hotel_name,
                            maximun_free_calendar_days,
                            check_in_hour_time: mapTimeToDateTime(check_in_hour_time),
                            check_out_hour_time: mapTimeToDateTime(check_out_hour_time),
                            minimal_prev_days_to_cancel,
                            iana_time_zone
                        }

                        var hotel = await createHotel({
                            admin_id: ctx.user.id,
                            ...hotelData
                        });
                        // console.log({ admin_id: ctx.user.id, hotelData, hotel })

                        return hotel;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),

        updateHotelName: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var {
                        hotel_id,
                        hotel_name,
                    } = args.input;
                    console.log({ args })
                    try {
                        // sanitation
                        var s_hotel_name = xss(hotel_name);
                        var hotel = await updateHotelName(hotel_id, s_hotel_name);
                        return hotel;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),

        updateHotelFreeCalendarDays: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var {
                        hotel_id,
                        maximun_free_calendar_days,
                    } = args.input;
                    try {
                        // sanitation
                        var hotel = await updateHotelFreeCalendarDays(hotel_id, maximun_free_calendar_days);
                        return hotel;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),

        updateHotelDaysToCancel: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var {
                        hotel_id,
                        minimal_prev_days_to_cancel,
                    } = args.input;
                    try {
                        var hotel = await updateHotelDaysToCancel(hotel_id, minimal_prev_days_to_cancel);
                        return hotel;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),

        updateHotelCheckIn: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var {
                        hotel_id,
                        check_in_hour_time,
                    } = args.input;
                    try {
                        check_in_hour_time = mapTimeToDateTime(check_in_hour_time);
                        var hotel = await updateHotelCheckInTime(hotel_id, check_in_hour_time);
                        return hotel;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),

        updateHotelCheckOut: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var {
                        hotel_id,
                        check_out_hour_time,
                    } = args.input;
                    try {
                        check_out_hour_time = mapTimeToDateTime(check_out_hour_time);
                        var hotel = await updateHotelCheckOutTime(hotel_id, check_out_hour_time);
                        return hotel;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),

        updateHotelTimeZone: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var {
                        hotel_id,
                        iana_time_zone,
                    } = args.input;
                    try {

                        var hotel = await updateHotelTimeZone(hotel_id, iana_time_zone);
                        return hotel;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),




        // room
        createRoomType: authenticated(
            authorized(
                [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role],
                async (root, args, ctx) => {
                    var {
                        room_type,
                    } = args.input;
                    try {
                        var roomType = await createRoomType(room_type);
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
                    var {
                        room_type,
                    } = args.input;
                    try {
                        var roomType = await deleteRoomType(room_type);
                        return roomType;
                    } catch (error) {
                        throw error;
                    }

                }
            )
        ),


    },
    // Root Types
    /// ---------------
    // User 
    // ---------------
    User: {
        __resolveType(obj, ctx, info) {
            if (obj.user_role) {
                if (
                    obj.user_role == USER_ROLES.FULL_ADMIN.user_role
                    || obj.user_role == USER_ROLES.BASIC_ADMIN.user_role
                ) {
                    return 'Admin'
                } else {
                    return 'Client'
                }
            }
            return null
        }
    },
};