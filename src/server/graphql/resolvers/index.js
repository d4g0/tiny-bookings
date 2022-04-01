import { USER_ROLES } from "dao/DBConstans";
import { createAdminService, getAdminsService, getUserByEmailPassword } from "services/users/admin";
import xss from "xss";
import jwt from 'jsonwebtoken';

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

            if (user) {
                var AdminAuth = {
                    userData: user,
                    token: null
                }

                var token = await jwt.sign(user, process.env.API_SECRET_KEY, {
                    algorithm: 'HS256',
                    expiresIn: '2h',
                    subject: `${user.user_id}`
                })
                AdminAuth.token = token;

                return AdminAuth;
            }
            return null;
        },

        async admins() {

            var admins = await getAdminsService()

            if (admins) {
                return admins
            }
            return null

        }

    },
    // ---------------
    // Mutation 
    // ---------------
    Mutation: {
        async createAdmin(root, args, ctx) {
            const {
                creator_admin_id,
                user_role,
                email,
                admin_name,
                admin_description,
                password,
            } = args.createAdminInput;

            ''.toLocaleLowerCase().trim()
            // sanitation non covered values will be
            // extrictly validated in down procesing layers
            var s_email = xss(email);
            var s_admin_name = xss(admin_name.toLocaleLowerCase().trim());
            var s_admin_description = xss(admin_description);

            var createdAdmin;

            try {
                createdAdmin = await createAdminService({
                    creator_admin_id,
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