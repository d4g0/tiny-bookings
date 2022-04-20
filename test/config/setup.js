const { connect } = require('../../src/db/PrismaClient');
const { initUserRoles } = require('../../src/dao/users/UserRoleDao.js');
require('dotenv').config();
module.exports = async function setup() {
    try {
        await connect();
        await initUserRoles();
    } catch (error) {
        console.log(error);
        throw error;
    }
}