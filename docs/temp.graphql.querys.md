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

## Rooms

### CreateRoomType
```graphql
mutation CreateRoomType ($input: RoomTypeInput!){
  createRoomType(input:$input){
    id,
    room_type
  }
}
# input
{
  "input": {
    "room_type": "Matrimonial-22"
  }
}
```

### DeleteRoomType
```graphql
mutation DeleteRoomType ($input: RoomTypeInput!){
  deleteRoomType(input:$input){
    id,
    room_type
  }
}

# input
{
  "input": {
    "room_type": "Matrimonial-22"
  }
}
```

### GetRoomType
```graphql
query getRoomType($input: RoomTypeInput!){
  getRoomType(input:$input){
    id
    room_type
  }
}
# input
{
  "input": {
    "room_type": "Matrimonial"
  }
}
```

### GetRoomTypes
```graphql
query getRoomTypes{
  getRoomTypes{
    id
    room_type
  }
}
```