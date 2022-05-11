import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
/**
 * The limiter middleware
 */
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 1000
});


/** @type RequestHandler */
export function auth(req, res, next) {
    // the auth metadata module
    // to insert in the request
    // to be consulted in the request chain
    var auth = {
        isAuth: false,
        userData: null
    }

    // validate and verify
    var authHeader = req.get('Authorization');

    // case not auth to varify
    if (!authHeader) {
        req.auth = auth;
        return next();
    }

    // verify
    const token = authHeader.split(' ')[1];
    // case not token found
    if (!token || token == '') {
        req.auth = auth;
        return next();
    }

    // verify the token
    try {
        const payload = jwt.verify(token, process.env.API_SECRET_KEY, { algorithms: ["HS256"] });



        // req.auth = payload.;
        auth.isAuth = true;
        auth.userData = payload;
        req.auth = auth;

        console.log({
            loc: 'authMiddd',
            authDetails: {
                userID: auth.userData.id,
                user_role: auth.userData.user_role,
            },
            payload
        })

        return next();

    } catch (error) {

        console.log({
            loc: 'authMiddd',
            auth,
            error
        })

        req.auth = auth;
        return next();
    }




}

export function quickLogger(req, res, next) {
    // operationName: 'IntrospectionQuery'
    if(req.body['operationName'] =='IntrospectionQuery' ){
        return next();
    }
    var now = new Date().toISOString().slice(0, -5);
    console.log('-------------------');
    console.log(now)
    // console.log(req.url)
    // console.log(req.get('Origin'))
    // console.log(req.get('X-Captcha'))
    console.log(req.method)
    console.log(req.body);
    console.log('-------------------');
    next();
}