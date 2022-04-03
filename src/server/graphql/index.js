import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '~/server/graphql/resolvers';
import { typeDefinitions } from 'server/graphql/typeDefs';
import {
  getUserFromToken,
  getTokenFromReq,
  createAdminToken
} from '~/server/graphql/auth'


const executableSchema = makeExecutableSchema({
  typeDefs: typeDefinitions,
  resolvers
});
const server = new ApolloServer({
  schema: executableSchema,
  context({ req }) {

    const token = getTokenFromReq(req);
    const user = getUserFromToken(token);
    return { user, createAdminToken }
  },
  formatError(error) {

    // custom errors
    if (error?.extensions?.exception?.code) {

      return {
        ...error,
        // bubble up custom error code
        code: error.extensions.exception.code
      }
    }

    return error;
  }
});

export default server;