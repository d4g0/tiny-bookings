require('dotenv').config()
const Joi = require('joi');
var param = process.argv[2] || 'foo@bar.baz';

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

testToekn();