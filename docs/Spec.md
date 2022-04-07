## Internal Data models 
**Services and up layer, DAO handle db structure internals**

### USER_ROLES
-   FULL_ADMIN
-   BASIC_ADMIN
-   CLIENT


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
```js
  room:{
    id,
    hotel_id,
    room_name
    night_price
    capacity
    number_of_beds
    room_type         // maped room_type string
    amenities         // amenities string array
    room_pictures     // room_pictures array
    created_at
  }

  // sample full
  sample_room: {
    id: 468,
    hotel_id: 386,
    room_name: '5605ed26-a',
    night_price: 10,
    capacity: 2,
    number_of_beds: 1,
    room_type: 'b72f9820-a',
    amenities: [ { id: 76, amenity: 'fb5cd71f-4' } ],
    room_pictures: [ { id: 101, room_id: 468, filename: 'supper-foo-picture' } ],
    created_at: 'Thu, 07 Apr 2022 05:46:45 GMT'
  },

```