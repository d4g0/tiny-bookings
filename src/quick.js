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

function checkString(){
    const stringSchema = Joi.string();
    const { error, value } = stringSchema.validate(1)
    console.log({
        error,
        value
    })
}

checkString()