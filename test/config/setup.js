const connect = require('../../src/dao/PrismaClient.js')
module.exports = async function setup() {
    try {
        await connect();
    } catch (error) {

    }
}