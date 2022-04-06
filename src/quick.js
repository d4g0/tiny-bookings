'use strict'
require('dotenv').config()
const Joi = require('joi');
var param = process.argv[2] || 'foo@bar.baz';
var set = require('date-fns/set');

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


testDate();


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

testJoi()