import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
const SECRET = process.env.API_SECRET_KEY || '';

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
    if (req.body['operationName'] == 'IntrospectionQuery') {
        return next();
    }
    var now = new Date().toISOString().slice(0, -5);
    console.log('\n\r' , '-------------------');
    console.log(now);
    // console.log(req.url)
    // console.log(req.get('Origin'))
    // console.log(req.get('X-Captcha'))
    console.log('Bearer: ', req.get('Authorization'));
    console.log('method: ', req.method);
    console.log('headers/content-type: ', req.get('content-type'));
    console.log('query: ', req.query);
    console.log('body: ', req.body);
    console.log('user: ', req.user);
    console.log('-------------------');
    next();
}



export function getTokenFromReqQuery(req) {
    // validate and verify


    // verify
    const token = req.query.token;



    // case not token found
    if (!token || token == '') {
        return null;
    }

    return token;

}


export function getUserFromToken(token) {

    

    if (!token) {
        return null
    }
    try {

        const user = jwt.verify(token, SECRET, { algorithms: ["HS256"] });


        return user;

    } catch (e) {

        // console.log({ error: e });

        return null
    }

}

export const authenticate = (req, res, next) => {

    const token = getTokenFromReqQuery(req);

    if (!token) {
        return next();
    }
    const user = getUserFromToken(token);

    // console.log({ user });


    if (!user) {
        return next();
    }

    req.user = user;
    return next();
}

export const authenticated = (req, res, next) => {

    if (!req.user) {
        return res.status(403).json({ error: new AuthenticationError('must authenticate') });
    }

    return next();
}


export const authorized = (role_s) => (req, res, next) => {

    // if not valid role to check stop chain
    if (!(typeof role_s == 'string' || Array.isArray(role_s))) {
        throw new Error('Dont mess around with non covered roles dude');
    }
    // case a simple role to check
    if (typeof role_s == 'string') {
        if (req.user.user_role !== role_s) {
            return res.status(403).json({ error: new ForbiddenError(`Forbidden`) });
        }
    }
    // case is a set of roles to check (array)
    if (Array.isArray(role_s)) {
        if (!role_s.includes(req.user.user_role)) {
            return res.status(403).json({ error: new ForbiddenError(`Forbidden`) });
        }
    }

    return next();
}