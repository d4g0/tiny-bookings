/**
 * This file abstracts: 
 * authentication: the art of know if you `are` the one you say you are
 * authorization:  the art of know if you `can` do the thing you want to do
 * 
 * In an intention to decouple that logic from graphql resolvers.
 * It has been influenced by the Advance GraphQL FrontEnd Masters Course on 
 * the subjetc by Scott Moss.
 * 
 */
import jwt from 'jsonwebtoken';
import { $fetch } from 'ohmyfetch';
const SECRET = process.env.API_SECRET_KEY || 'foo-key';
const { AuthenticationError, ForbiddenError } = require('apollo-server-core');

export function getTokenFromReq(req) {
    // validate and verify
    var authHeader = req.get('Authorization');

    // case not auth to verify
    if (!authHeader) {
        return null;
    }

    // verify
    const token = authHeader.split(' ')[1];
    // case not token found
    if (!token || token == '') {
        return null;
    }

    return token;

}





export function createUserToken({
    id,
    user_role
}) {
    return jwt.sign(
        {
            id,
            user_role
        },
        SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '2h',
        }
    );
}



export function getUserFromToken(token) {
    if (!token) {
        return null
    }
    try {

        const user = jwt.verify(token, SECRET, { algorithms: ["HS256"] });
        return user;

    } catch (e) {
        return null
    }

}


export const authenticated = next => (root, args, context, info) => {

    if (!context.user) {
        throw new AuthenticationError('must authenticate')
    }

    return next(root, args, context, info)
}


export const authorized = (role_s, next) => (root, args, context, info) => {

    // if not valid role to check stop chain
    if (!(typeof role_s == 'string' || Array.isArray(role_s))) {
        throw new Error('Dont mess around with non covered roles dude');
    }
    // case a simple role to check
    if (typeof role_s == 'string') {
        if (context.user.user_role !== role_s) {
            throw new ForbiddenError(`Forbidden`);
        }
    }
    // case is a set of roles to check (array)
    if (Array.isArray(role_s)) {
        if (!role_s.includes(context.user.user_role)) {
            throw new ForbiddenError(`Forbidden`);
        }
    }



    return next(root, args, context, info)
}

export async function isCaptchaClear(req) {

    var isClear = false;
    var captchaToken = req.get('X-Captcha');

    if (!captchaToken) {
        return isClear;
    }

    try {

        const GOOGLE_VERIFY_ENDPOINT = `https://www.google.com/recaptcha/api/siteverify`;

        var gcRes = await $fetch(GOOGLE_VERIFY_ENDPOINT, {
            method: 'POST',
            params: {
                secret: process.env.G_CHAPTCHA_SECRET_KEY,
                response: captchaToken,
            }
        });

        // throw if validation fails
        if (!gcRes.success) {
            throw new Error(gcRes['error-codes'].join('\n'));
        }

        isClear = true;
        return isClear;

    } catch (error) {
        return isClear;
    }
}