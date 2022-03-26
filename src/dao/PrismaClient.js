import { PrismaClient } from '@prisma/client'


/**
 * The Prisma Singleton Instace
 */
export const prisma = new PrismaClient();


export async function connect() {
    return prisma.$connect;
}

export async function disconnect() {
    return prisma.disconnect
}
