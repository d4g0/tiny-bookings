import { USER_ROLES } from "dao/DBConstans";
import { createAdminService, getAdminsService, getUserByEmailPassword } from "services/users/admin";
import xss from "xss";
import {
    isInAdminRoles,
    isFullAdmin
} from "dao/utils";
import { authenticated, authorized } from "./auth";

export const resolvers = {
    /// ---------------
    // Unions 
    // ---------------
    LoginResult: {
        __resolveType(obj, ctx, info) {
            if (obj.userData) {
                if (
                    obj.userData.user_role == USER_ROLES.FULL_ADMIN.user_role
                    || obj.userData.user_role == USER_ROLES.BASIC_ADMIN.user_role
                ) {
                    return 'AdminAuth'
                } else {
                    return 'ClientAuth'
                }
            }
            return null
        }
    },
    // ---------------
    // Query 
    // ---------------
    Query: {
        info: () => `Info here`,

        // ---------------
        // Login 
        // ---------------
        async login(root, args, ctx) {

            var { email, password } = args.loginInput;
            var user = await getUserByEmailPassword(email, password);

            console.group('Login')
            console.log({ user })
            console.groupEnd()

            if (user) {
                var AdminAuth = {
                    userData: user,
                    token: null
                }

                var token = ctx.createAdminToken({
                    id: user.id,
                    user_role: user.user_role,
                    email: user.email,
                    admin_name: user.admin_name,
                    created_at: user.created_at,
                });

                AdminAuth.token = token;

                return AdminAuth;
            }
            return null;
        },

        admins: authenticated(
            // authorized(
            //     USER_ROLES.FULL_ADMIN,
                async () => {
                    var admins = await getAdminsService();
                    if (admins) {
                        return admins
                    }
                    return null
                }
            // )
        )

    },
    // ---------------
    // Mutation 
    // ---------------
    Mutation: {
        async createAdmin(root, args, ctx) {
            const {
                user_role,
                email,
                admin_name,
                admin_description,
                password,
            } = args.createAdminInput;

            var { isAuth, userData } = ctx.req.auth;

            // authtentication checks
            if (!isAuth) {
                var error = new Error('Non Authenticated');
                error.code = 401;
                throw error;
            }

            // console.group('(resolvers/createAdmin)')
            // console.log({ userData })
            // console.groupEnd()

            // authorization check

            // user role validation
            if (!isFullAdmin(userData.user_role)) {
                var error = new Error(`Non Authorized`);
                error.code = 401;
                throw error;
            }


            // sanitation non covered values will be
            // extrictly validated in down procesing layers
            var s_email = xss(email);
            var s_admin_name = xss(admin_name.toLocaleLowerCase().trim());
            var s_admin_description = xss(admin_description);

            var createdAdmin;

            try {
                createdAdmin = await createAdminService({
                    creator_admin_id: userData.id,
                    user_role,
                    email: s_email,
                    admin_name: s_admin_name,
                    admin_description: s_admin_description,
                    password,
                })

            } catch (error) {
                throw error
            }


            return createdAdmin;
        }
    }
};