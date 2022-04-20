
require('dotenv').config()
const sql = require('./db/postgres.js')

async function test() {
    var bsRes = await sql`
        select * from booking_states bs where bs.booking_state = 'non-exisisting-booking-state'
    `

    console.log({ bsRes });
}

test()