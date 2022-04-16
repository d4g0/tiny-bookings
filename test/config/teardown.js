const { disconnect } = require('../../src/dao/PrismaClient.js');
const sql = require('../../src/db/postgres.js');
const { disconnectPostgres } = require('../../src/db/postgres.js');
module.exports = async function teardown() {
    try {
        await disconnect();
        // console.log(sql);
        await disconnectPostgres();
        console.log('tear down');
    } catch (error) {
        console.log(error)
    }
}