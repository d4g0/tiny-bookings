# GraphQL API Querys
- [GraphQL API Querys](#graphql-api-querys)
  - [Login](#login)
  - [Rooms](#rooms)
    - [CreateRoomType](#createroomtype)
    - [DeleteRoomType](#deleteroomtype)
    - [GetRoomType](#getroomtype)
    - [GetRoomTypes](#getroomtypes)
    - [UpdateRoomType](#updateroomtype)
    - [CreateRoomAmenity](#createroomamenity)
    - [Get RoomAmenity](#get-roomamenity)
    - [Get RoomAmenities](#get-roomamenities)
    - [UpdateRoomAMenity](#updateroomamenity)
    - [DeleteRoomAmenity](#deleteroomamenity)
    - [Create a room](#create-a-room)
    - [DeleteARoom](#deletearoom)
    - [updateRoomName](#updateroomname)
    - [UpdateARoomIsType](#updatearoomistype)
    - [UpdateNightPrice](#updatenightprice)

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

### UpdateRoomType
```graphql
mutation UpdateRoomType ($input: RoomTypeUpdateInput!){
  updateRoomType(input:$input){
    id,
    room_type
  }
}
# input
{
  "input":{
    "room_type": "Matrimonial",
    "new_room_type": "Matrimonial-2"
  }
}
```

### CreateRoomAmenity
```graphql
mutation CreateRoomAmenity ($input: RoomAmenityInput!){
  createRoomAmenity(input:$input){
    id,
    amenity
  }
}
{
  "input": {
    "amenity": "Aire Acondicionado"
  }
}
```

### Get RoomAmenity
```graphql
query getAmenity($input:RoomAmenityInput!){
  getRoomAmenity(input:$input){
    id
    amenity
  }
}
{
  "input": {
    "amenity": "Aire Acondicionado"
  }
}
```




### Get RoomAmenities
```graphql
query {
  getRoomAmenities{
    id
    amenity
  }
}
```

### UpdateRoomAMenity
```graphql
mutation UpdateRoomAmenity ($input:RoomAmenityUpdateInput!){
 updateRoomAmenity(input:$input){
    id,
    amenity
  }
}
{
  "input": {
    "amenity": "Aire Acondicionado",
    "new_amenity": "Aire Acondicionado Mas Fuelte"
  }
}
```

### DeleteRoomAmenity
```graphql
mutation delRoomAmenity ($input: RoomAmenityInput!){
 deleteRoomAmenity(input:$input){
    id,
    amenity
  }
}
{
  "input": {
    "amenity": "Aire Acondicionado Mas Fuelte"
  }
}
```


### Create a room
```graphql
# create room
mutation CreateARoom($input: CreateRoomInput!){
  createRoom(input:$input){
		id
    hotel_id
    room_name
    night_price
    capacity
    number_of_beds
    room_type
    amenities
    rooms_amenities {
      id
      room_id
      amenity_id
    }
    room_pictures {
      id
      room_id
      filename
    }
    created_at
  }
}

{
	"input":{
	"hotel_id": 227,
  "room_name": "Blue Room",
    "night_price": 20,
    "capacity": 2,
    "number_of_beds": 1
  }
}
```

### DeleteARoom
```graphql
mutation deleteARoom($input: DeleteRoomInput!){
	deleteRoom(input:$input){
    id
    room_name
  }
}
{
  "input": {
			"id": 526
  }
}
```

### updateRoomName
```graphql
mutation updateRoomName($input: UpdateRoomNameInput!){
	updateRoomName(input:$input){
    id
    room_name
  }
}
{
  "input": {
			"id": 527,
			"room_name": "Marazul 2"
  }
}
```


### UpdateARoomIsType
```graphql
mutation updateARoomIsType($input: UpdateRoomIsTypeInput!){
	updateARoomIsType(input:$input){
    id
    hotel_id
    room_name
    night_price
    capacity
    number_of_beds
    room_type
    room_type_key
    amenities
    rooms_amenities {
      id
      room_id
      amenity_id
    }
    room_pictures {
      id
      room_id
      filename
    }
    created_at
  }
}

{
 "input": {
  "room_id": 528,
  "room_type_id": 733
}
}
```

### UpdateNightPrice
```graphql
mutation updateNightPrice($input:UpdateRoomNightPriceInput!){
  updateRoomNightPrice(input:$input){
    id
    hotel_id
    room_name
    night_price
    capacity
    number_of_beds
    room_type
    room_type_key
    amenities
    rooms_amenities {
      id
      room_id
      amenity_id
    }
    room_pictures {
      id
      room_id
      filename
    }
    created_at
  }
}
```