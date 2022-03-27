import { prisma, connect, disconnect } from 'dao/PrismaClient.js'
import { spinUpServer } from '~/server'
async function main() {

    // connect to db
    await connect();
    // spin up the server
    spinUpServer();
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        // disconnect from db
        await disconnect()
    })