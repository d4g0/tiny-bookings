# GraphQL API Querys
- [GraphQL API Querys](#graphql-api-querys)
  - [Login](#login)
  - [Admins](#admins)
    - [Create Admin](#create-admin)
    - [Delete admin](#delete-admin)
  - [Hotel](#hotel)
    - [createHotel](#createhotel)
  - [Rooms](#rooms)
    - [Get A Room](#get-a-room)
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
    - [updateRoomCapacity](#updateroomcapacity)
    - [updateNumberOfBeds](#updatenumberofbeds)
    - [CreateARoomIsAmenity](#createaroomisamenity)
    - [DeleteARoomIsAmenity](#deletearoomisamenity)
    - [GetRoomLocks](#getroomlocks)
    - [GetARoomIsLocks](#getaroomislocks)

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

## Admins
```graphql
query admins{
  admins{
    id
    user_role
    admin_name
  }
}
```
### Create Admin
```graphql
mutation createAdmin($input:createAdminInput!){
  createAdmin(input:$input){
		id
    user_role
    email
    admin_name
    admin_description
    hash_password
    reset_token
    created_at
  }
}

{
  "input":{
		"user_role":  "BASIC_ADMIN",
    "email":      "susy@gmail.com",
    "admin_name": "susy",
    "admin_description": "susy likes salsa",
    "password":  "supper-foo-pass"
  }
}
```

### Delete admin
```graphql
mutation deleteAdmin{
  deleteAdmin(id:19){
    id
    user_role
    admin_name
  }
}
```


## Hotel
### createHotel
```graphql
mutation createHotel($input:HotelInput!){
  createHotel(input:$input){
		id
    hotel_name
    maximun_free_calendar_days
    check_in_hour_time
    check_out_hour_time
    minimal_prev_days_to_cancel
    iana_time_zone
  }
}

{
  "input":{
"hotel_name":"Graphy Hotel",
"maximun_free_calendar_days": 30,
"minimal_prev_days_to_cancel":5,
"check_in_hour_time":{
  "hours": 10,
  "mins": 0
},
"check_out_hour_time":{
  "hours": 13,
  "mins": 30
},
"iana_time_zone":"America/Lima"
  }
}
```


## Rooms

### Get A Room
```graphql
query {
  room(room_id: 528){
    id
		hotel_id
		room_name
		night_price
		capacity
		number_of_beds
		created_at
    room_type
    room_types{
			id
      room_type
    }
    room_pictures{
      id
      room_id
      filename
    }
    rooms_amenities{
      room_id
      amenity_id
      room_amenity {
        id
        amenity
      }
    }
  }
}
```

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
    rooms_amenities{
      room_id
      amenity_id
      room_amenity {
        id
        amenity
      }
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
    room_types{
      id
      room_type
    }
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
  }
}

{
  "input":{
		"room_id": 528,
		"new_night_price": 340
  }
}
```

### updateRoomCapacity
```graphql
mutation updateCapacity($input:UpdateRoomCapacityInput!){
  updateRoomCapacity(input:$input){
    id
    room_name
    capacity
  }
}
{
  "input":{
		"room_id": 528,
		"new_capacity": 5
  }
}
```

### updateNumberOfBeds
```graphql
mutation updateNumberOfBeds($input:UpdateRoomNumberOfBedsInput!){
  updateRoomNumberOfBeds(input:$input){
    id
    room_name
    number_of_beds
  }
}
{
  "input":{
		"room_id": 528,
		"new_number_of_beds": 15
  }
}
```



### CreateARoomIsAmenity
```graphql
mutation CreateARoomIsAmenity ($input: CreateARoomIsAmenityInput!){
  createARoomIsAmenity(input:$input){
    room_id
    amenity_id
  }
}
{
  "input": {
    "room_id": 175,
    "amenity_id": 32
  }
}
```


### DeleteARoomIsAmenity
```graphql
mutation DeleteARoomIsAmenity ($input: DeleteARoomIsAmenityInput!){
  deleteARoomIsAmenity(input:$input){
    count
  }
}
{
  "input": {
    "room_id": 175,
    "amenity_id": 32
  }
}
```


### GetRoomLocks
```graphql
query getRoomLocks($input: GetRoomLocksInput!){
  getRoomLocks(input:$input){
    results{
      id
      room_id
      start_date
      end_date
      reason
      is_a_booking
      booking_id
      created_at
    }
    count
  }
}

{
  "input": {
    "start_date_filter": {
      "year": 2022,
      "month": 3,
      "day": 18,
      "hour": 0,
      "minute": 0
    },
    "end_date_filter":  {
            "year": 2022,
      "month": 5,
      "day": 25,
      "hour": 0,
      "minute": 0
    },
    "page": 1
  }
}
```


### GetARoomIsLocks
```graphql
query getARoomIsLocks($input: GetARoomIsLocksInput!){
  getARoomIsLocks(input:$input){
    results{
      id
      room_id
      start_date
      end_date
      reason
      is_a_booking
      booking_id
      created_at
    }
    count
  }
}

{
  "input": {
    "start_date_filter": {
      "year": 2022,
      "month": 3,
      "day": 18,
      "hour": 0,
      "minute": 0
    },
    "end_date_filter":  {
            "year": 2022,
      "month": 5,
      "day": 25,
      "hour": 0,
      "minute": 0
    },
    "page": 1,
    "room_id_filter": 91
  }
}
```