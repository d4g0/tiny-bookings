## Internal Data models 
**Services and up layer, DAO handle db structure internals**
- [Internal Data models](#internal-data-models)
  - [USER_ROLES](#user_roles)
  - [ADMIN](#admin)
  - [Creation](#creation)
- [Auth Middleware](#auth-middleware)
- [Hotel](#hotel)
- [RoomType](#roomtype)
- [RoomAmenitiy](#roomamenitiy)
- [Room](#room)
  - [Raw Db cooming result (postgres.js)](#raw-db-cooming-result-postgresjs)
  - [Mapped Value to work in the api](#mapped-value-to-work-in-the-api)
  - [Delete room  response](#delete-room--response)
- [Room Lock Period](#room-lock-period)
- [Client](#client)
- [Booking State](#booking-state)
- [Payment Type](#payment-type)
- [Booking](#booking)
- [Payment Type](#payment-type-1)
- [Booking State](#booking-state-1)
- [Currency](#currency)
- [Client Payment](#client-payment)
- [Create A Booking as Admin](#create-a-booking-as-admin)


### USER_ROLES
-   FULL_ADMIN
-   BASIC_ADMIN
-   CLIENT

Anatomy:
```js
 var userRole = { id: 1, user_role: 'user-role-key' } ;
```
DB Table name: `user_roles`
A UserRoles Table is intended to be used as `enums`, but currently the pgadmin erd tool don't support those; 
so as the diagram and their respective sql mapped script are the single source of `true` by design flow 
election, this project it's using a one to many relation from `user_roles` to `admin` and `client` users.
In this context it makes sense `create` and `read` `user_roles` records; but not update or delete those;
the latter just implemented to clean the `dev-db` when testing.
Make sure when starting the `initUserRoles` fn runs properly, in the test and in the actual server as part of 
the bootin secuence. If fails to complete you might need to restore the `dev` db


### ADMIN
```js
{   
    id:                 number, // integer
    user_role:          USER_ROLES.FULL_ADMIN || USER_ROLES.BASIC_ADMIN,
    email:              String,
    admin_name:         String,
    admin_description:  String,
    hash_password:      String,
    reset_token:        String || null,
    created_at:         String (ISO Date)
}
```
Token for admin auth
```js
  jwt_payload : {
    id,
    user_role,
    email,
    admin_name,
    created_at,
  }
```

### Creation
```js
    {
        creator_admin_id,
        user_role,
        email,
        admin_name,
        admin_description,
        password,
    }
```
Creational constrains:
Admin:
-   `password` String min(8) max(24)
-   Creator Admin `id` integer, it has to be a `FULL_ADMIN` role in db


## Auth Middleware

```js
auth: {
    isAuth: true,
    userData: {
      id: 1,
      user_role: 'FULL_ADMIN',
      email: 'tocarralero@gmail.com',
      admin_name: 'dago',
      admin_description: 'system creator',
      hash_password: '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C',
      reset_token: null,
      created_at: '2022-03-28T04:03:46.415Z',
      iat: 1648832543,
      exp: 1648839743,
      sub: '1'
    }
  }

```


## Hotel
```js
  hotel: {
    
        id: 35,
        hotel_name: 'Test Hotel',
        maximun_free_calendar_days: 30,
        check_in_hour_time: 1970-01-01T13:30:00.000Z,
        check_out_hour_time: 1970-01-01T12:00:00.000Z,
        minimal_prev_days_to_cancel: 5
  }

```
## RoomType
```js
  {
    id: 0,
    room_type: 'type'
  }
```

## RoomAmenitiy
```js
  {
    id: 0,
    amenity: 'type'
  }
```


## Room

### Raw Db cooming result (postgres.js)
```js
 // raw
  var new_room_data = {
        id: 234,
        hotel_id: 176,
        room_name: '69fe1219-8',
        night_price: '10',
        capacity: 2,
        number_of_beds: 1,
        created_at: '2022-04-26 03:16:46',
        room_type_id: 103,  // can be null
        room_type_key: 'bfe2b40e-6',  // can be null
        room_pictures: [ '28   supper-foo-picture' ], // can be an empty array
        room_amenities: [ '39   06d9fae7-2', '40   908334cb-d' ] // can be an empty array
      }
  }
```

### Mapped Value to work in the api
```js
 var new_room_data = {
        id: 234,
        hotel_id: 176,
        room_name: '69fe1219-8',
        night_price: '10',
        capacity: 2,
        number_of_beds: 1,
        created_at: '2022-04-26 03:16:46',
        room_type_id: 103,
        room_type_key: 'bfe2b40e-6',
        room_pictures: [ {room_picture_id: 28  , filename: 'supper-foo-picture'} ],
        room_amenities: [ {amenity_id:39, amenity: '06d9fae7-2'} ]
      }
  }
```

### Delete room  response
```js
  
var delRes = {
        completed: true,
        count: 1
}
```

## Room Lock Period

```js
  var roomLockPeriod: {
        id: 11,
        room_id: 23,
        start_date: '2022-05-16T03:53:00.000Z',
        end_date: '2022-05-17T03:53:00.000Z',
        reason: '[Gardining] We are going to grow some plants in this room',
        created_at:'2022-04-16T03:53:56.000Z',
        during: '["2022-05-15 23:53:00","2022-05-16 23:53:00"]',
        is_a_booking: false,
        booking_id: null
  }
```

## Client
```js
var client = {
        id: 2,
        user_role: 3,
        client_name: 'ac19d0e6-8',
        client_last_name: 'ab84179e-d',
        hash_password: null,
        email: null,
        is_email_verified: false,
        reset_token: null,
        created_at: '2022-04-16T04:00:00.000Z'
      }
```

## Booking State
```js
var bookingState = { id: 3, booking_state: '8b25b9be-5' }

```

## Payment Type
```js
var paymentType= { id: 4, payment_type: 'c5c6c4df-7' }
```

## Booking
```js
var booking = {
        id: 6,
        client_id: 6,
        hotel_id: 3,
        booking_state: 6,
        currency: null,
        total_price: '50',
        start_date: '2022-05-16T08:51:00.000Z',
        end_date: '2022-05-17T08:51:00.000Z',
        number_of_guests: '2',
        created_at: '2022-04-16T08:51:21.000Z'
      }
```

## Payment Type
```js
  var paymentType = {
        "id": 4,
        "payment_type": "CASH"
  }
```

## Booking State
```js
  var bookingState = {
        "id": 9,
        "booking_state": "PAYMENT_PENDING"
  }
```

## Currency
```js
    var currency = {
            "id": 3,
            "currency": "USD"
    }
```

## Client Payment
Might have or not a booking id reference

```js
    var clientPayment = {
        id: 3,
        client_id: 12,
        amount: '200.50',
        booking_reference: null,
        payment_type: 1,
        currency: 1,
        effectuated_at: '2022-04-21 02:56:16'
      }


```

## Create A Booking as Admin
Success Response sample
```js

var res = {
      client: {
        id: 47,
        user_role: 3,
        client_name: '02ac9685-b',
        client_last_name: '26a0ea05-a',
        hash_password: null,
        email: null,
        is_email_verified: false,
        reset_token: null,
        created_at: '2022-04-21 06:29:54'
      },
      booking: {
        id: 25,
        client_id: 47,
        hotel_id: 38,
        booking_state: 1,
        total_price: 300,
        start_date: '2022-05-21 06:29:00',
        end_date: '2022-05-22 06:29:00',
        number_of_guests: 4,
        is_cancel: false,
        created_at: '2022-04-21 06:29:54'
      },
      clientPayment: {
        id: 36,
        client_id: 47,
        amount: '300.00',
        booking_reference: 25,
        payment_type: 1,
        currency: 1,
        effectuated_at: '2022-04-21 06:29:54'
      },
      roomLocks: [
        {
          id: 28,
          room_id: 50,
          start_date: '2022-05-21 06:29:00',
          end_date: '2022-05-22 06:29:00',
          reason: 'Booked',
          created_at: '2022-04-21 06:29:54',
          during: '["2022-05-21 06:29:00","2022-05-22 06:29:00"]',
          is_a_booking: true,
          booking_id: 25
        },
        {
          id: 29,
          room_id: 51,
          start_date: '2022-05-21 06:29:00',
          end_date: '2022-05-22 06:29:00',
          reason: 'Booked',
          created_at: '2022-04-21 06:29:54',
          during: '["2022-05-21 06:29:00","2022-05-22 06:29:00"]',
          is_a_booking: true,
          booking_id: 25
        }
      ],
      roomBookings: [ { room_id: 50, booking_id: 25 }, { room_id: 51, booking_id: 25 } ]
    }


```