## Internal Data models 
**Services and up layer, DAO handle db structure internals**

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
    created_at:         String (Date)
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
Create and update Model of room
```js
  room:{
    id,
    hotel_id,
    room_name,
    night_price,
    capacity,
    number_of_beds,
    created_at,
    room_type,
    room_types,
    room_pictures,
    rooms_amenities,
  }

  // sample full
  sample_room:{
    "id": 528,
    "hotel_id": 227,
    "room_name": "Marazul 30",
    "night_price": "340",
    "capacity": 5,
    "number_of_beds": 15,
    "created_at": "2022-04-07T23:19:57.852Z",
    "room_type": 733,
    "room_types": {
        "id": 733,
        "room_type": "Triple"
    },
    "room_pictures": [ { "id": 101, "room_id": 468, "filename": "file" } ], // might be an empty array
    "rooms_amenities": [
        {
            "room_id": 528,
            "amenity_id": 26,
            "room_amenity": {
                "id": 26,
                "amenity": "Air conditioner"
            }
        }
    ] // might be an empty array
  }

  var noDependenciesRoom room : {
        id: 143,
        hotel_id: 29,
        room_name: 'db8d5efd-1',
        night_price: 10,
        capacity: 2,
        number_of_beds: 1,
        created_at: 2022-04-10T01:32:55.534Z,
        room_pictures: [],
        room_type: null,
        room_types: null,
        rooms_amenities: []
  }


```

Delete room model response


```js
  
var del_res = {
        id: 585,
        hotel_id: 407,
        room_name: '7693b0fb-1',
        night_price: 10,
        capacity: 2,
        number_of_beds: 1,
        room_type: null,
        created_at: '2022-04-08T17:47:05.558Z',
        room_pictures: [],
        room_types: null,
        rooms_amenities: []
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