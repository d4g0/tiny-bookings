import { PrismaClient } from '@prisma/client'
const client = new PrismaClient();
export async function getFullAdminRole() {
    return client.user_roles.findFirst({
        where:{
            role:'full-admin'
        }
    })
}

export async function foo() {
    // return client.admins.
}