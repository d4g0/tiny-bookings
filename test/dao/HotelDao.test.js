import {
    createHotel,
    deleteHotelById,
    updateHotelName,
    updateHotelCheckInTime,
    updateHotelCheckOutTime,
    updateHotelFreeCalendarDays,
    updateHotelDaysToCancel,
    getHotelById,
} from "dao/HotelDao";
import { createHotel as createHotelS, updateHotelTimeZone } from "~/services/hotel"
const { createAdmin, deleteAdminById } = require("dao/UserDao");
const { mapTimeToDateTime } = require("dao/utils");
import { USER_ROLES } from '~/dao/DBConstans'
import { NOT_FOUND_RECORD_ERROR_KEY } from "dao/Errors";
import { v4 as uuid } from 'uuid';

describe(
    'Hotel Dao',

    function hoetlDaoTest() {

        var hotelData = {
            hotel_name: 'Test Hotel',
            maximun_free_calendar_days: 30,
            check_in_hour_time: mapTimeToDateTime({ hours: 13, mins: 30 }),
            check_out_hour_time: mapTimeToDateTime({ hours: 12, mins: 0 }),
            minimal_prev_days_to_cancel: 5,
            iana_time_zone:'America/Lima'
        }

        var updateHotelInput = {
            hotel_name: 'Test Hotel Update',
            maximun_free_calendar_days: 15,
            check_in_hour_time: mapTimeToDateTime({ hours: 5, mins: 30 }),
            check_out_hour_time: mapTimeToDateTime({ hours: 10, mins: 0 }),
            minimal_prev_days_to_cancel: 10,
            iana_time_zone:'America/Lima'
        }

        var fullAdminData = {
            user_role: USER_ROLES.FULL_ADMIN.user_role,
            email: 'test-full@email.com',
            admin_name: 'admin:' + uuid(),
            admin_description: 'test admin for development',
            hash_password: 'supper foo hash password ',
            reset_token: 'supper reset token for test admin',
        }

        test(
            "Creates and Deletes A Hotel",
            async function () {

                var dbError = null, fooHotel = null, delHotel = null;
                // new Date().toUTCString
                try {
                    fooHotel = await createHotel(hotelData);
                    delHotel = await deleteHotelById(fooHotel.id);
                    console.log({
                        fooHotel,
                        delHotel
                    })

                } catch (error) {
                    dbError = error;
                }
                expect(fooHotel).toBeDefined();
                expect(fooHotel.id).toBeDefined();
                expect(fooHotel.hotel_name).toBeDefined();
                expect(fooHotel.maximun_free_calendar_days).toBeDefined();
                expect(fooHotel.check_in_hour_time).toBeDefined();
                expect(fooHotel.check_out_hour_time).toBeDefined();
                expect(fooHotel.minimal_prev_days_to_cancel).toBeDefined();
                expect(fooHotel.iana_time_zone).toBeDefined();
                expect(dbError).toBe(null);
            }
        );

        test(
            "Delete a hotel that does not exists",
            async function () {
                var dbError = null;

                try {
                    await deleteHotelById(100000);
                } catch (error) {
                    dbError = error
                    console.log(error)
                }

                expect(dbError).toBeDefined();
                expect(dbError?.code).toBe(NOT_FOUND_RECORD_ERROR_KEY);
            }
        )

        test(
            "Update a hotel",
            async function () {

                var dbError = null, fooHotel, updatedFooHotel;

                try {
                    fooHotel = await createHotel(hotelData);
                    // name
                    updatedFooHotel = await updateHotelName(fooHotel.id, 'Supper Foo Hotel');
                    // check_in_hour_time
                    updatedFooHotel = await updateHotelCheckInTime(fooHotel.id, mapTimeToDateTime({ hours: 3, mins: 10 }));
                    // check_out_hour_time
                    updatedFooHotel = await updateHotelCheckOutTime(fooHotel.id, mapTimeToDateTime({ hours: 3, mins: 10 }));
                    // maximun_free_calendar_days
                    updatedFooHotel = await updateHotelFreeCalendarDays(fooHotel.id, 90);
                    // minimal_prev_days_to_cancel
                    updatedFooHotel = await updateHotelDaysToCancel(fooHotel.id, 10);
                    // iana_time_zone
                    updatedFooHotel = await updateHotelTimeZone(fooHotel.id, 'America/Havana');


                    // clean
                    await deleteHotelById(fooHotel.id);
                    console.log({ updatedFooHotel })
                } catch (error) {
                    console.log(error)
                    dbError = error
                }

                expect(updatedFooHotel.id).toBeDefined();
                expect(dbError).toBe(null);
            }
        )

        test(
            "Crate Hotel Service",
            async function () {
                var dbError = null, fooAdmin = null, hotel = null;


                try {
                    fooAdmin = await createAdmin(fullAdminData);
                    hotel = await createHotelS({
                        admin_id: fooAdmin.id,
                        ...hotelData,
                    })

                    console.log({ hotel })
                    // clean 
                    await deleteAdminById(fooAdmin.id);
                    await deleteHotelById(hotel.id);

                } catch (error) {
                    console.log(error)
                    dbError = error
                }

                expect(dbError).toBeNull();
                expect(hotel.id).toBeDefined();
                expect(hotel.hotel_name).toBe(hotelData.hotel_name)
                expect(hotel.check_in_hour_time).toBe(hotelData.check_in_hour_time.toUTCString())
                expect(hotel.check_out_hour_time).toBe(hotelData.check_out_hour_time.toUTCString())
                expect(hotel.maximun_free_calendar_days).toBe(hotelData.maximun_free_calendar_days)
                expect(hotel.minimal_prev_days_to_cancel).toBe(hotelData.minimal_prev_days_to_cancel)
                expect(hotel.iana_time_zone).toBe(hotelData.iana_time_zone)
            }
        )


        test(
            "Get Hotel By Id",
            async function () {
                var dbError = null, hotel = null, fooHotel = null;

                try {
                    fooHotel = await createHotel(hotelData);
                    hotel = await getHotelById(fooHotel.id);

                    console.log({ hotelById: hotel });
                    // clean
                    await deleteHotelById(hotel.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBeNull();
                expect(hotel.id).toBeDefined();
            }

        )


    }

)
