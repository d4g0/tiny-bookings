import { prisma, connect, disconnect } from 'dao/PrismaClient.js'
import { getAdminByName } from 'dao/UserDao.js'

async function main() {

    // connect to db
    await connect();
    const admin = await getAdminByName('dago');
    console.log({ admin })

    try {
        const seeWhatHappens = await getAdminByName(() => { });
        console.log(seeWhatHappens);
    } catch (error) {
        console.log('stay calm')
        console.log(error)
    }

}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        // disconnect from db
        await disconnect()
    })