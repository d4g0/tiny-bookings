# GraphQL API Querys
- [GraphQL API Querys](#graphql-api-querys)
  - [Login](#login)
  - [Admins](#admins)
    - [Login as Admin](#login-as-admin)
    - [Get Admins](#get-admins)
    - [Create Admin](#create-admin)
    - [Delete admin](#delete-admin)
  - [Hotel](#hotel)
    - [createHotel](#createhotel)
    - [Get a Hotel](#get-a-hotel)
    - [Get Hotels](#get-hotels)
    - [Update Hotel Check in](#update-hotel-check-in)
    - [Update Hotel Check out](#update-hotel-check-out)
    - [Pending craft other dao fn respective querys](#pending-craft-other-dao-fn-respective-querys)
  - [Rooms Types](#rooms-types)
    - [CreateRoomType](#createroomtype)
    - [DeleteRoomType](#deleteroomtype)
    - [GetRoomType](#getroomtype)
    - [GetRoomTypes](#getroomtypes)
    - [UpdateRoomType](#updateroomtype)
  - [Amenities](#amenities)
    - [CreateRoomAmenity](#createroomamenity)
    - [Get RoomAmenity](#get-roomamenity)
    - [Get RoomAmenities](#get-roomamenities)
    - [UpdateRoomAMenity](#updateroomamenity)
    - [DeleteRoomAmenity](#deleteroomamenity)
  - [Room](#room)
    - [Get A Room](#get-a-room)
    - [Get Rooms](#get-rooms)
    - [Create a room](#create-a-room)
    - [DeleteARoom](#deletearoom)
    - [updateRoomName](#updateroomname)
    - [UpdateARoomIsType](#updatearoomistype)
    - [UpdateNightPrice](#updatenightprice)
    - [updateRoomCapacity](#updateroomcapacity)
    - [updateNumberOfBeds](#updatenumberofbeds)
  - [Room Availability](#room-availability)
  - [Room is Amenities](#room-is-amenities)
    - [CreateARoomIsAmenity](#createaroomisamenity)
    - [DeleteARoomIsAmenity](#deletearoomisamenity)
  - [Room Locks](#room-locks)
    - [GetRoomLocks](#getroomlocks)
    - [GetARoomIsLocks](#getaroomislocks)
  - [Get Payment Types](#get-payment-types)
  - [Booking State](#booking-state)
  - [Currency](#currency)
  - [Get Client Payments](#get-client-payments)
  - [Create a Booking as Admin](#create-a-booking-as-admin)
  - [cancelABooking](#cancelabooking)
  - [Get Bookings](#get-bookings)
  - [Get Bookings As Client](#get-bookings-as-client)
  - [Get Client for admin](#get-client-for-admin)
  - [Get Clients](#get-clients)
  - [Clients](#clients)
    - [Login as Client](#login-as-client)
    - [SingUp](#singup)





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
          user_role
          client_name
					client_last_name
          created_at	
        }
        
      },
      token
      token_created_at
  }
}

variables:{
  "input": {
	"email": "dago@gmail.com",
  "password": "supper-foo-pass"
  }
}
```

## Admins


### Login as Admin
```graphql
query loginAsAdmin($input: loginInput! ){
  loginAsAdmin(input:$input){  
     admin{ 
        	id
      		user_role
       		email
        	admin_name
        	admin_description   		
        	created_at       
      },
      token
      token_created_at
  }
}

#variables
{
  "input": {
	"email": "dago@gmail.com",
  "password": "supper-foo-pass"
  }
}

```
### Get Admins
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
    created_at
  }
}



{
  "input":{
		"user_role_id":  2,
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
  deleteAdmin(id:169){
    completed
    count
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
"hotel_name":"Sloppy Joe's Grand Hotel",
"maximun_free_calendar_days": 90,
"minimal_prev_days_to_cancel":5,
"check_in_hour_time":{
  "hours": 10,
  "minutes": 0
},
"check_out_hour_time":{
  "hours": 13,
  "minutes": 30
},
"iana_time_zone":"America/Lima"
  }
}

```

### Get a Hotel
```graphql
{
  hotel(id: 56){
    id
    hotel_name
  }
}
```

### Get Hotels
```graphql
{
  hotels{
    id
    hotel_name
  }
}
```

### Update Hotel Check in
```graphql
mutation updateHotelCheckIn($input: UpdateHotelCheckIn!){
  updateHotelCheckIn(input:$input){
    id
    hotel_name
    check_in_hour_time
  }
}

{
  "input": {
    "hotel_id": 56,
    "check_in_hour_time": {
      "hours": 11,
      "minutes": 30
    }
  }
}
```

### Update Hotel Check out
```graphql
mutation updateHotelCheckOut($input: UpdateHotelCheckOut!){
  updateHotelCheckOut(input:$input){
    id
    hotel_name
    check_out_hour_time
  }
}

{
  "input": {
    "hotel_id": 56,
    "check_out_hour_time": {
      "hours": 14,
      "minutes": 30
    }
  }
}
```

### Pending craft other dao fn respective querys


## Rooms Types
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
## Amenities
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

## Room
### Get A Room
```graphql
query {
  room(room_id: 52){
 		id
    hotel_id
    room_name
    night_price
    capacity
    number_of_beds
    created_at
    room_type_id
    room_type_key
    room_pictures{
      room_picture_id
      filename
    }
    room_amenities{
      amenity_id
      amenity
    }
  }
}
```

### Get Rooms
```graphql
query{
  rooms(hotel_id_filter: 39){
    id
    hotel_id
    room_name
    night_price
    capacity
    number_of_beds
    created_at
    room_type_id
    room_type_key
    room_pictures{
      room_picture_id
      filename
    }
    room_amenities{
      amenity_id
      amenity
    }
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
    created_at
    room_type_id
    room_type_key
    room_pictures{
      room_picture_id
      filename
    }
    room_amenities{
      amenity_id
      amenity
    }
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

## Room Availability
```graphql
query getRoomsAvailableIn($input:getRoomsAvailableInput!){
  getRoomsAvailable(input:$input){
		id
    hotel_id
    room_name
    night_price
    capacity
    number_of_beds
    room_type_id
    room_type_key
    room_pictures{
      room_picture_id
      filename
    }
    room_amenities{
      amenity_id
      amenity
    }
  }
}

{
  "input": {
    "hotel_id": 1,
    "start_date": {
      "year": 2022,
      "month": 4,
      "day": 10,
      "hour": 10,
      "minute": 0
    },
    "end_date": {
      "year": 2022,
      "month": 4,
      "day": 12,
      "hour": 10,
      "minute": 0
    }
  }
}
```

## Room is Amenities

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

## Room Locks

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
    "page": 1,
    "hotel_id":1,
    "start_date_filter": {
      "year": 2022,
      "month": 3,
      "day": 28,
      "hour": 10,
      "minute": 0
    },
    "end_date_filter": {
      "year": 2022,
      "month": 3,
      "day": 30,
      "hour": 10,
      "minute": 0
    }
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

## Get Payment Types
```graphql
query {
  getPaymentTypes{
		id
    payment_type
  }
}
```

## Booking State
```graphql
query {
  getBookingStates{
		id
    booking_state
  }
}
```


## Currency
```graphql
query {
  getCurrencies{
		id
    currency
  }
}
```


## Get Client Payments
```graphql
query getClientPayments($input: GetClientPaymentsInput!){
  getClientPayments(input:$input){
    results {
      id
      client_id
      amount
      booking_reference
      payment_type
      currency
      effectuated_at
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

## Create a Booking as Admin
```graphql
mutation createABookingAsAdmin($input: createBookingAsAdmin!){
  	
  createBookingAsAdmin(input: $input){
    id
    hotel_id
    client_id
    booking_state
    total_price
    start_date
    end_date
    number_of_guests
    is_cancel
    created_at
  }
  
}
{
  "input": {
    "start_date": {
      "year": 2022,
      "month": 3,
      "day": 10,
      "hour": 10,
      "minute": 0
    },
    "end_date": {
      "year": 2022,
      "month": 3,
      "day": 12,
      "hour": 10,
      "minute": 0
    }, 
    "rooms_ids": [102],
    "hotel_id": 39,
    "client_name": "Lolo ",
    "client_last_name": "Zanchez de la Concepcion",
    "total_price": 200,
    "currency_id": 1,
    "payment_type_id": 1,
    "number_of_guests": 2
  }
}
```

## cancelABooking

```graphql
mutation cancelABooking{
  cancelBooking(bookingId: 66){
    id
    client_id
    hotel_id
    booking_state
    total_price
    start_date
    end_date
    number_of_guests
    is_cancel
    created_at
  }
}
```

## Get Bookings
```graphql
query getBookings($input: GetBookingsInput!){
  getBookings(input: $input){
    results{
      id
      client_id
      hotel_id
      booking_state
      total_price
      start_date
      end_date
      number_of_guests
      is_cancel
      created_at
    }
    count
  }
}

{
  "input": {
    "hotel_id": 1,
    "start_date_filter": {
      "year": 2022,
      "month": 1,
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

## Get Bookings As Client
Requires a client to be logued in 
```graphql
query getClientBookings($input: GetBookingsInput!){
  getClientBookingsAsClient(input: $input){
    results{
      id
      client_id
      hotel_id
      booking_state
      total_price
      start_date
      end_date
      number_of_guests
      is_cancel
      created_at
    }
    count
  }
}

{
  "input": {
    "start_date_filter": {
      "year": 2022,
      "month": 0,
      "day": 18,
      "hour": 0,
      "minute": 0
    },
    "end_date_filter":  {
      "year": 2022,
      "month": 10,
      "day": 25,
      "hour": 0,
      "minute": 0
    },
    "page": 1
  }
}
```



## Get Client for admin
```graphql
query getClientForAdmin{
  getClientForAdmin(id:155){
    id
    client_name
    client_last_name
    user_role
    email
    hash_password
    created_at
  }
}
```

## Get Clients
```graphql
query getClients($input: PaginationInput!){
  getClients(input:$input){
    results{
      id
      client_name
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

## Clients

### Login as Client
```graphql
query loginAsClient($input: loginInput! ){
  loginAsClient(input:$input){  
     client{ 
        	id
      		user_role
       		email
        	client_name
          client_last_name
          created_at
      },
      token
      token_created_at
  }
}

{
  "input": {
	"email": "lafy@gmail.com",
  "password": "supper-foo-pass"
  }
}
```

### SingUp

```graphql
mutation SingUp($input: SingUpInput!){
  singUp(input:$input){
    client{
          id
          user_role
          client_name
					client_last_name
          email
          created_at
    }
    token
    token_created_at
  }
}



{
  "input": {
  	 "client_name": "casidy4",
    "client_last_name": "valdez",
    "password": "supper-foo-pass",
    "email": "casidy4@gmail.com"
  }
}
# header
{
  "X-Captcha": "captcha response token"
}
```