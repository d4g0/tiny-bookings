// type admin {
//   id: ID!
//   admin_name: String!
// }

//   admin(name:String){
//     id
//     admin_name
//   }






export const typeDefinitions = `

  enum USER_ROLE {
    FULL_ADMIN
    BASIC_ADMIN
    CLIENT
  }

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

  

  type Query {

    info: String!

    login(name: String!): Admin!
  }

  type Mutation {
    createAdmin(caInp: createAdminInput!) : Admin!
  }

  schema {
    query: Query,
    mutation: Mutation,
  }

`;

