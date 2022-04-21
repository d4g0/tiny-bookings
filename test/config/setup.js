require('dotenv').config();
const { connect } = require('../../src/db/PrismaClient');
const { initUserRoles } = require('../../src/dao/users/UserRoleDao.js');
const { initBookingStates } = require('dao/booking/BookingStateDao');
const { initPaymentTypes } = require('dao/payments/PaymentTypeDao');
const { initCurrencies } = require('dao/currencies/CurrencyDao');
module.exports = async function setup() {
    try {
        await connect();
        await initUserRoles();
        await initBookingStates();
        await initPaymentTypes();
        await initCurrencies();
    } catch (error) {
        console.log(error);
        throw error;
    }
}