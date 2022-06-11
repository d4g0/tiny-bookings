import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '~/server/graphql/resolvers';
import { readFileSync } from 'fs';
import path from 'path';
import {
    getUserFromToken,
    getTokenFromReq,
    createUserToken,
    isCaptchaClear,
} from '~/server/graphql/auth';

const typeDefinitions = readFileSync(path.join(__dirname, '/schema.graphql'), 'utf8');

const executableSchema = makeExecutableSchema({
    typeDefs: typeDefinitions,
    resolvers,
});
const server = new ApolloServer({
    schema: executableSchema,
    context({ req }) {
        const token = getTokenFromReq(req);
        const user = getUserFromToken(token);
        return { user, createUserToken, req, isCaptchaClear };
    },
    playground: false,
    // formatError(error) {
    //   return error;
    // }
});

export default server;
