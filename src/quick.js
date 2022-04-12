'use strict'
require('dotenv').config()
const Joi = require('joi');
var param = process.argv[2] || 'foo@bar.baz';
var set = require('date-fns/set');
const moment = require('moment-timezone');
const { DateTime, Zone } = require('luxon');

function emailCheck() {
    const emailSchema = Joi.string().email();
    const { error, value } = emailSchema.validate(param)
    console.log({
        error,
        value
    })
}
// emailCheck();

function checkString() {
    const stringSchema = Joi.string();
    const { error, value } = stringSchema.validate(1)
    console.log({
        error,
        value
    })
}

// checkString()


// tokens

// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken');

async function testToekn() {

    const data = {
        user_id: 1,
        admin_name: 'dago',
        email: 'foo@gmail.com'
    }

    const token = await jwt.sign(
        data,
        process.env.API_SECRET_KEY,
        {
            algorithm: 'HS256',
            expiresIn: '2h',
            subject: `${data.user_id}`
        }
    );

    const diferentSignedToken = await jwt.sign(
        data,
        process.env.API_SECRET_KEY,
        {
            algorithm: 'none',
            expiresIn: '2h',
            subject: `${data.user_id}`
        }
    );

    var auth = {
        userData: null,
        isAtuh: false
    }
    try {
        auth.userData = await jwt.verify(diferentSignedToken, process.env.API_SECRET_KEY);
        auth.isAtuh = true;
    } catch (error) {
        auth.userData = null;
        auth.isAtuh = false;
    }

    console.log({ auth });


}

// testToekn();



function testDate() {

    const { format, utcToZonedTime, } = require("date-fns-tz");
    const today = new Date();
    const timeZone = 'Europe/Paris';
    const peruTimeZone = 'America/Lima';
    const timeInBrisbane = utcToZonedTime(today, timeZone);
    const timeInPeru = utcToZonedTime(today, peruTimeZone);
    var dateForm = 'yyyy-MM-dd HH:mm:ss';
    var timeAcumulator = [
        {
            country: 'Cuba',
            date: format(today, dateForm)
        },
        {
            country: 'Peru',
            date: format(timeInPeru, dateForm)
        }
    ]
    console.table(timeAcumulator);

    // console.log(`
    //     Default time zone: ${format(today, 'yyyy-MM-dd HH:mm:ss')}
    //     Time in Paris: ${format(timeInBrisbane, 'yyyy-MM-dd HH:mm:ss')}
    //     Time in Peru: ${format(timeInPeru, 'yyyy-MM-dd HH:mm:ss')}
    //     `
    // );

    const utcDate1 = new Date(Date.UTC(96, 1, 2, 3, 4, 5));
    utcDate1.setUTCHours(10, 10, 0)
    var now = new Date();




    var dateObj = {
        year: now.getUTCFullYear(),
        month: now.getUTCMonth(),
        date: now.getUTCDate(),
        hours: now.getUTCHours(),
        mins: now.getUTCMinutes(),
        secs: now.getUTCSeconds(),
    }



    var time = mapTimeToDateTime({ hours: 23, mins: 0 });
    var time2 = mapTimeToDateTime({ hours: 24, mins: 0 });
    console.log({ time, time2 });

    function extracTime(date) {
        new Date().getUTCHours();
        new Date().getUTCMinutes();
    }


}

function mapTimeToDateTime({ hours, mins, secs = 0 }) {
    var now = new Date(Date.UTC(2020, 0, 1, 0, 0, 0));
    now.setUTCHours(hours, mins, secs);
    return now;
}


// testDate();


function testFnObjParams() {
    function foo(data = {
        bar,
        baz
    }) {

        var {
            bar,
            baz
        } = data || 'barzybaz';

        try {
            console.log({ bar, baz });
        } catch (error) {
            console.log(error)
        }
    }
    foo();
}

// testFnObjParams();

function testJoi() {
    var str = 'f6c-4a51-841b-9f65929e50eb';
    const isValidNameStr = isValidRoomName(str);
    console.log(isValidNameStr)
}

function isValidRoomName(room_name) {
    var roomNameSchema = Joi.string().trim().min(4).max(20);
    var { error, value } = roomNameSchema.validate(
        room_name,
        { presence: 'required', convert: false }
    )

    console.log({ error, value });
    return !error;
}

// testJoi()

function quickDate() {
    var today = makeUTCDate({ year: 1970, month: 0 })
    // console.log({
    //     today,
    //     timeISO: today.toISOString(),
    //     timeUTC: today.toUTCString(),
    //     utcH: today.getUTCHours(),
    //     utcD: today.getUTCDate(),

    // });
    var tz = moment.tz.names();
    console.table(tz)
}

function makeUTCDate({
    year = 1,
    month = 1,
    day = 1,
    hour = 0,
    min = 0,
    sec = 0
}) {
    return new Date(Date.UTC(year, month, day, hour, min, sec, 0));
}
// quickDate()

function testDateFnsTz() {
    const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')

    // Set the date to "2018-09-01T16:01:36.386Z"
    const utcDate = zonedTimeToUtc('2018-09-01 18:01:36.386', 'Europe/Berlin')

    // Obtain a Date instance that will render the equivalent Berlin time for the UTC date
    const date = new Date('2018-09-01T16:01:36.386Z')
    const timeZone = 'Europe/Berlin'
    const zonedDate = utcToZonedTime(date, timeZone)
    // zonedDate could be used to initialize a date picker or display the formatted local date/time

    // Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
    const pattern = 'd.M.yyyy HH:mm:ss.SSS \'GMT\' XXX (z)'
    const output = format(zonedDate, pattern, { timeZone: 'Europe/Berlin' })
}

// testDateFnsTz()


function getUTCCurrentDate() {
    // return new Date().getUTC()
}

function mapYearMonthDayDateToUTC({ year = 1970, month = 0, day = 1 }) {
    var utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    return utcDate;
}

function setUTCHourTime({ date, hours, mins }) {
    date.setUTCHours(hours, mins, 0, 0);
    return date;
}

// validate start date
// generate a start_date UTC Date obj with provided values
// init a current UTC Date
// check start_date Date is greater or equal then current utc_date Date

var start_date = { year: 2022, month: 0, day: 1 };
var utc_start_date = mapYearMonthDayDateToUTC(start_date);
var today_utc = DateTime.fromObject({ minute: 0, second: 0, millisecond: 0 }, { zone: 'utc' });
// console.log({
//     utc_start_date,
//     today_utc_String: today_utc.toString()
// })

function utcDate({
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
}) {
    return new Date(Date.UTC(
        year, month, day, hour, minute
    ));
}

// 'America/New_York'
// 'Australia/Victoria'
// 'Israel' 


// console.log({
//     today,
//     isralDate: isralDate.toISO(),
//     victoriaDate: victoriaDate.toISO()
// })

var dt = DateTime.now();
// console.log(dt.year);
// console.log(dt.month);
// console.log(dt.day);
// console.log(dt.second);
// console.log(dt.weekday);

function mapYearMonthDayDateToUTC({ year = 1970, month = 0, day = 1 }) {
    var utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    return utcDate;
}

function getCurrentUTCDayDate() {
    var dt = DateTime.now();
    var dayDate = utcDate({
        year: dt.year,
        month: dt.month,
        day: dt.day
    })

    return dayDate;
}
// 2022-05-11T00
var d_utc = mapYearMonthDayDateToUTC({
    year: 2022,
    month: 4,
    day: 12
})

var c_utc = getCurrentUTCDayDate();
const MILISECONDS_IN_A_DAY = 86400000;
var today = new Date();
var tomorrow = new Date(c_utc.valueOf() + MILISECONDS_IN_A_DAY);
console.log({
    c_utc,
    d_utc,
    'd_utc > c_utc': d_utc > c_utc,
    'c_utc > d_utc': c_utc > d_utc,
    'c_utc == d_utc': c_utc.valueOf() == d_utc.valueOf(),
    'c_utc - d_utc': c_utc.valueOf() - d_utc.valueOf(),
    'c_utc - d_utc': d_utc - c_utc,
    tomorrow,
    // c_utc_g: '',
    // c_utc_iso: c_utc.toISOString()
})



function isAValidDateObj(date) {
    var a = { a: 'a' };
    a.prototype.constructor
    return date.pro
}


var r = Object.prototype.toString.call(new Date());

console.log({ r })