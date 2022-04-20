import { PrismaClient } from '@prisma/client'


/**
 * The Prisma Singleton Instace
 */
export const prisma = new PrismaClient();

/**
 * Connects the singleton client db
 * @returns {Promise}
 */
export async function connect() {
    return prisma.$connect;
}

/**
 * Disconnect the singleton client db
 * @returns {Promise}
 */
export async function disconnect() {
    return prisma.disconnect
}
