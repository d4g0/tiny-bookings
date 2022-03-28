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
                admin_name:'dago'
            }
        }
    }
};