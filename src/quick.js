
// require('dotenv').config()
// const sql = require('./db/postgres.js')

// async function test() {
//     var bsRes = await sql`
//         select * from booking_states bs where bs.booking_state = 'non-exisisting-booking-state'
//     `

//     console.log({ bsRes });
// }

// test()

function hourTimeToSQLTimeStr({ hours, minutes }) {
    var time = {
        hours, minutes
    }

    // hour
    if (hours < 10) {
        time.hours = `0${hours}`
    } else {
        time.hours = `${hours}`
    }

    // minutes
    if (minutes < 10) {
        time.minutes = `0${minutes}`
    } else {
        time.minutes = `${minutes}`
    }


    return `${time.hours}:${time.minutes}`

}

function test() {
    const time1 = {
        hours: 0,
        minutes: 0
    };
    const time2 = {
        hours: 12,
        minutes: 20
    };
    
    const timeStr1 = hourTimeToSQLTimeStr(time1);
    const timeStr2 = hourTimeToSQLTimeStr(time2);

    var r = {
        timeStr1,
        'time1 match timeStr1': '00:00' == timeStr1,
        timeStr2,
        'time2 match timeStr2': '12:20' == timeStr2,
    }
    console.log(r)
}

test()