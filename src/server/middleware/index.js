import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
/**
 * The limiter middleware
 */
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
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