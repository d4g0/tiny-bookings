// type admin {
//   id: ID!
//   admin_name: String!
// }

//   admin(name:String){
//     id
//     admin_name
//   }






export const typeDefinitions = `

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
    creator_admin_id: Int!
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
  }


  ##
  # Login
  ##

  input loginInput {
    email: String!
    password: String!
  }


  union LoginResult = Admin | Client



  ##
  # Query
  ##
  type Query {

    info: String!

    login(loginInput: loginInput!): LoginResult
  }

  ##
  # Mutation
  ##
  type Mutation {
    createAdmin(createAdminInput: createAdminInput!) : Admin!
  }


  ##
  # Schema Root
  ##
  schema {
    query: Query,
    mutation: Mutation,
  }

`;

