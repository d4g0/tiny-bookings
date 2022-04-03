import { USER_ROLES } from "dao/DBConstans";
import { createAdminService, getAdminsService, getUserByEmailPassword, deleteAdminById } from "services/users/admin";
import xss from "xss";
import { authenticated, authorized } from "./auth";

export const resolvers = {

    // ---------------
    // Query 
    // ---------------
    Query: {

        // ---------------
        // Login 
        // ---------------
        async login(root, args, ctx) {

            var Auth = {
                user: null,
                token: null,
                token_created_at: null,
            }


            var { email, password } = args.input;
            var user = await getUserByEmailPassword(email, password);

            // console.group('Login')
            // console.log({ user })
            // console.groupEnd()

            if (user) {

                Auth.user = user;

                var token = ctx.createAdminToken({
                    id: user.id,
                    user_role: user.user_role,
                    email: user.email,
                    admin_name: user.admin_name,
                    created_at: user.created_at,
                });

                Auth.token = token;
                Auth.token_created_at = new Date().toISOString();

                return Auth;
            }
            return Auth;
        },

        admins: authenticated(
            authorized(
                [
                    USER_ROLES.FULL_ADMIN.user_role,
                    USER_ROLES.BASIC_ADMIN.user_role
                ],
                async (root, args, ctx, info) => {
                    var admins = await getAdminsService();
                    if (admins) {

                        // filter current admin from results
                        var adminsMinusCurrentAdmin = admins.filter(admin => admin.id != ctx.user.id);
                        return adminsMinusCurrentAdmin;
                    }
                    return null
                }
            )
        )

    },
    // ---------------
    // Mutation 
    // ---------------
    Mutation: {
        createAdmin: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    const {
                        user_role,
                        email,
                        admin_name,
                        admin_description,
                        password,
                    } = args.input;

                    // sanitation non covered values will be
                    // extrictly validated in down procesing layers
                    var s_email = xss(email).trim();
                    var s_admin_name = xss(admin_name.toLocaleLowerCase().trim());
                    var s_admin_description = xss(admin_description).trim();

                    var createdAdmin;

                    try {
                        createdAdmin = await createAdminService({
                            creator_admin_id: ctx.user.id,
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
            )
        ),

        deleteAdmin: authenticated(
            authorized(
                USER_ROLES.FULL_ADMIN.user_role,
                async (root, args, ctx) => {
                    var id = args.id;
                    var deletedAdmin = await deleteAdminById(id);
                    return deletedAdmin;
                }
            )
        )
    },
    // Root Types
    /// ---------------
    // User 
    // ---------------
    User: {
        __resolveType(obj, ctx, info) {
            if (obj.user_role) {
                if (
                    obj.user_role == USER_ROLES.FULL_ADMIN.user_role
                    || obj.user_role == USER_ROLES.BASIC_ADMIN.user_role
                ) {
                    return 'Admin'
                } else {
                    return 'Client'
                }
            }
            return null
        }
    },
};