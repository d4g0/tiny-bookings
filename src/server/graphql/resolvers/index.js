import { createAdminService } from "services/users/admin";
import xss from "xss";

export const resolvers = {
    Query: {
        info: () => `Info here`,
        login: (root, args, ctx) => {
            console.log({
                root,
                args,
                ctx
            });

            return {
                id: 1,
                admin_name: 'dago'
            }
        },


    },
    Mutation: {
        async createAdmin(root, args, ctx) {
            console.log({ args })
            const {
                creator_admin_id,
                user_role,
                email,
                admin_name,
                admin_description,
                password,
            } = args.caInp;


            // sanitation non covered values will be
            // extrictly validated in down procesing layers
            var s_email = xss(email);
            var s_admin_name = xss(admin_name);
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