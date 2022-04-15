const { disconnect } = require('../../src/dao/PrismaClient.js');
const sql = require('../../src/dao/postgres');
module.exports = async function teardown() {
    try {
        await disconnect();
        await sql.default.end({ timeout: 1 });
        console.log('tear down');
    } catch (error) {
        console.log(error)
    }
}