import postgres from 'postgres'
import { DateTime } from 'luxon'

const sql = postgres({
    max: parseInt(process.env.PG_MAX_CONNECTIONS) || 2,
    types: {
        date: {
            to: 1184,
            from: [1082, 1114, 1184],
            serialize: x => {
                if (typeof x != 'string') {
                    throw new Error('Non string date detected')
                }
                return x
            },
            parse: x => x
        }
    }
});
// process.env.DATABASE_URL
// will use psql environment variables

export default sql

export async function disconnectPostgres() {
    return await sql.end({ timeout: 3 });
}