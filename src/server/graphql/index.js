import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '~/server/graphql/resolvers';
import { typeDefinitions } from '~/server/graphql/schema';



const executableSchema = makeExecutableSchema({
  typeDefs: typeDefinitions,
  resolvers
});
const server = new ApolloServer({
  schema: executableSchema,
  context: ({ req }) => ({ req })
});

export default server;