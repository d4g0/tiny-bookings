
import { createAPaymentType, deleteAPaymentType } from 'dao/booking/PaymentTypeDao';
import { v4 as uuid } from 'uuid'







describe(
    'Booking State Dao',

    function roomTypesDaoTest() {
        // create a room lock
        test(
            "Create and delete a booking state ",
            async function () {

                var dbError = null, paymentType = null, delpaymentType = null;

                try {
                    paymentType = await createAPaymentType(uuid().substring(0, 10));
                    delpaymentType = await deleteAPaymentType(paymentType.payment_type);
                    console.log({
                        paymentType,
                        delpaymentType
                    });
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(paymentType.id).toBeDefined();
                expect(delpaymentType.id).toBe(paymentType.id);
            }
        )



    })