import { connect, disconnect } from 'db/PrismaClient.js'
import { initUserRoles } from 'dao/users/UserRoleDao';
const { initBookingStates } = require('dao/booking/BookingStateDao');
import { spinUpServer, closeServer } from '~/server'
import sql from 'db/postgres';
import prexit from 'prexit'
import { initPaymentTypes } from 'dao/booking/PaymentTypeDao';
import { initCurrencies } from 'dao/currencies/CurrencyDao';


async function main() {

    // connect to db
    await connect();
    // seeding db
    await initUserRoles();
    await initBookingStates();
    await initPaymentTypes();
    await initCurrencies();
    // spin up the server
    spinUpServer();
}

main().catch((e) => {
    console.log(e)
    throw e
})


prexit(async () => {
    await sql.end({ timeout: 5 })
    await disconnect()
    await closeServer();
})