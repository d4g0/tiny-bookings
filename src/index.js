import { connect, disconnect } from 'dao/PrismaClient.js'
import { initUserRoles } from 'dao/users/UserRoleDao';
import { spinUpServer, closeServer } from '~/server'
import sql from '~/dao/postgres';
import prexit from 'prexit'


async function main() {

    // connect to db
    await connect();
    // init db
    await initUserRoles();
    // spin up the server
    spinUpServer();
}

main().catch((e) => {
    console.log(e)
    throw e
})


prexit(async () => {
    await sql.end({ timeout: 5 })
    await disconnect()
    await closeServer();
})