const disconnect = require('../../src/dao/PrismaClient.js');
module.exports = async function teardown(){
    try {
        await disconnect();
    } catch (error) {
        
    }
}