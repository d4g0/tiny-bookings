## Login

```graphql
query login($input: loginInput! ){
  login(input:$input){  
     user{
        __typename
        ... on Admin{
        	id
        	admin_name,
        	admin_description,
          user_role
        	created_at
        }
        ... on Client{
          id
          name
          user_role
        	created_at
        }
        
      },
      token
      token_created_at
  }
}

variables:{
  "input": {
	"email": "tocarralero@gmail.com",
  "password": "supper-foo-pass"
  }
}
```