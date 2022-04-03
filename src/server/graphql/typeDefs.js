import gql from 'graphql-tag';

export const typeDefinitions = gql`

  ##
  # Generals
  ##
  enum USER_ROLE {
    FULL_ADMIN
    BASIC_ADMIN
    CLIENT
  }



  ##
  # ADMIN
  ##
  type Admin {
    id: ID!
    user_role:          String!
    email:              String!
    admin_name:         String!
    admin_description:  String
    hash_password:      String!
    reset_token:        String
    created_at:         String! 
  }

  input createAdminInput {
    user_role: USER_ROLE!
    email: String!
    admin_name: String!
    admin_description: String
    password: String!
  }



  ##
  # Client
  ##
  type Client {
    id: ID!
    name: String!
    user_role:          String!
    hash_password:      String
    reset_token:        String
    created_at:         String!
  }


  ##
  # Login
  ##

  input loginInput {
    email: String!
    password: String!
  }

  union User = Admin | Client

  type Auth {
    user: User!
    token: String!
    token_created_at: String!
  }


  ##
  # Query
  ##
  type Query {

    login(input: loginInput!): Auth!

    admins: [Admin]!


  }

  ##
  # Mutation
  ##
  type Mutation {
    createAdmin(input: createAdminInput!) : Admin!
    deleteAdmin(id: Int!): Admin!
  }


  ##
  # Schema Root
  ##
  schema {
    query: Query,
    mutation: Mutation,
  }

`;

