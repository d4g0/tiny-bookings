import postgres from 'postgres'

const sql = postgres({ 
    max: parseInt(process.env.PG_MAX_CONNECTIONS) || 2 
});
// process.env.DATABASE_URL
// will use psql environment variables

export default sql

export async function disconnectPostgres() {
    return await sql.end({ timeout: 3 });
}