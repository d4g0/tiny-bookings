import jwt from 'jsonwebtoken';
const SECRET = process.env.API_SECRET_KEY || 'foo-key';
const { AuthenticationError } = require('apollo-server-core');

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

export function createAdminToken({
    id,
    user_role,
    email,
    admin_name,
    created_at,
}) {
    return jwt.sign(
        {
            id,
            user_role,
            email,
            admin_name,
            created_at,
        },
        SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '2h',
        }
    );
}

// pending createCLientToken()



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
    // console.log({
    //     context
    // })
    if (!context.user) {
        throw new AuthenticationError('must authenticate')
    }

    return next(root, args, context, info)
}


export const authorized = (role_s, next) => (root, args, context, info) => {
    console.log({
        role_s,
        user_role: context.user.user_role
    })
    // case a simple role to check
    if (typeof role_s == 'string') {
        if (context.user.user_role !== role) {
            throw new AuthenticationError(`Not Authroizaced`);
        }
    }
    // case is a set of roles to check (array)
    if (Array.isArray(role_s)) {
        if (!role_s.includes(context.user.user_role)) {
            throw new AuthenticationError(`Not Authroizaced`);
        }
    }

    return next(root, args, context, info)
}