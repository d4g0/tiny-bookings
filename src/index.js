import { generateHashedPassword } from 'utils/hashString'

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // ... you will write your Prisma Client queries here
    var adminData = {
        user_name: 'dago',
        user_role: 'full_admin',
        email: 'tocarralero@gmail.com',
        hash_password: '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C',

    }
    // await prisma.admin_user.delete({
    //     where:{
    //         email: 'tocarralero@gmail.com'
    //     }
    // });
    
    // await prisma.admin_user.create({
    //     data: adminData
    // })

    var admin = await prisma.admin_user.findFirst();
    console.log({
        admin
    })
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })