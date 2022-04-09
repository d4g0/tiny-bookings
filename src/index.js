import { connect, disconnect } from 'dao/PrismaClient.js'
import { initUserRoles } from 'dao/users/UserRoleDao';
import { spinUpServer } from '~/server'
async function main() {

    // connect to db
    await connect();
    // init db
    await initUserRoles();
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