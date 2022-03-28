// type admin {
//   id: ID!
//   admin_name: String!
// }

//   admin(name:String){
//     id
//     admin_name
//   }






export const typeDefinitions = `

  type Admin {
    id: ID!
    user_role:          String!
    admin_name:         String!
    admin_description:  String
    hash_password:      String!
    reset_token:        String
    created_at:         String! 

  }

  type Query {

    info: String!

    login(name: String!): Admin

   
  }

  schema {
    query: Query,
  }

`;

