require('dotenv').config();
const { connect } = require('../../src/db/PrismaClient');
const { initUserRoles } = require('../../src/dao/users/UserRoleDao.js');
const { initBookingStates } = require('dao/booking/BookingStateDao');
module.exports = async function setup() {
    try {
        await connect();
        await initUserRoles();
        await initBookingStates();
    } catch (error) {
        console.log(error);
        throw error;
    }
}