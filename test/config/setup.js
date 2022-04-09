const { connect } = require('../../src/dao/PrismaClient')
const { initUserRoles } = require('../../src/dao/users/UserRoleDao.js')
module.exports = async function setup() {
    try {
        await connect();
        await initUserRoles();
    } catch (error) {
        console.log(error);
        throw error;
    }
}