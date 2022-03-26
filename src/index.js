import { prisma, connect, disconnect } from '~/dao/PrismaClient'


async function main() {
    
    // connect to db
    await connect();
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        // disconnect from db
        await disconnect()
    })