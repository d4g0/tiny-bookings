const { disconnect } = require('../../src/db/PrismaClient.js');
const sql = require('../../src/db/postgres.js');
module.exports = async function teardown() {
    try {
        await disconnect();
        await sql.end({timeout:3});
        console.log('tear down completed');
    } catch (error) {
        console.log(error)
    }
}