// db.js
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL) // will use psql environment variables

export default sql