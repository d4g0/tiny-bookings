
import { createABookingState, deleteABookingState } from 'dao/booking/BookingStateDao';
import { v4 as uuid } from 'uuid'







describe(
    'Booking State Dao',

    function roomTypesDaoTest() {
        // create a room lock
        test(
            "Create and delete a booking state ",
            async function () {

                var dbError = null, bstate = null, delBstate = null;

                try {
                    bstate = await createABookingState(uuid().substring(0, 10));
                    delBstate = await deleteABookingState(bstate.booking_state);
                    console.log({
                        bstate,
                        delBstate
                    });
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(bstate.id).toBeDefined();
                expect(delBstate.id).toBe(bstate.id);
            }
        )



    })