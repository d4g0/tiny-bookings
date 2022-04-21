# Arquitecture

- [Arquitecture](#arquitecture)
  - [Requirement Map](#requirement-map)
    - [General](#general)
    - [For all users types (admins, and clients)](#for-all-users-types-admins-and-clients)
    - [From client](#from-client)
    - [From admin](#from-admin)
      - [Operations Roles](#operations-roles)
        - [`full-admin`](#full-admin)
  - [Notes](#notes)
    - [Availability](#availability)
  - [NEW Features ideas](#new-features-ideas)

## Requirement Map

### General
-	Authentication
-	Autorization

### For all users types (admins, and clients)
-   Reset their password
    -   Clients only
        -   Recover their password by email (forgot my password flow)

### From client
-   Check for rooms availability by `date interval of travel` and `number of companions`
-   Select the offer of the result if there is availability
-   Procced with the reservation
    -   Provide
        -   name
        -   email
    -   Payment Data (*todo* to define)
-   List his bookings


### From admin
-	Operations

####	Operations
-	Create a hotel
-	Edit hotel data
-	Create Rooms
-	Edit Rooms Availability (locking rooms for a time)
-	Edit Rooms data
-	Create bookings
	-	Create Clients (as owner of the reservation)
-	Cancel bookings
-	Create admins [optional, just owner or business manager]
-	List bookings
-	List clients

#### Operations Roles
-   role: [all roles]
    -   defered
    -   reset his password
    -   recover his password by email

-   role: client
    -   search for bookings availability
    -   create a booking
    -   lis their bookings

-   role: `basic-admin`
    -	edit rooms availability 
        - creating room locks
        - deleting room locks
    -	edit rooms data
        -   create, delete and edit room types
        -   create, delete and edit room amenities
        -   create, delete and edit room pictures
    -	create bookings
    	-	create clients (for bookings)
    -	cancel bookings (delete)
    -	list bookings
    -   list room locks
    -	list clients
    -   list payments


-   role: `full-admin`
    -	[basic-admin]*
    -	create and edit a hotel
    -	create basic admin users    
    -	create full admin users 
    -	list admins users
    -   delete other admin users
    -	create rooms
    -   delete rooms


##### `full-admin`

[✅]
-   create admin users
    -   basic
    -   create new `basic-admin` with
        -   name
        -   email
        -   password
    -   full
    -   create new `full-admin` with
        -   name
        -   email
        -   password
[✅]
-   list admins

[✅]
-   delete admin

[✅]
-	create and edit a hotel 
    -   start (3-april-11:38)
        -   Dao
            -   create done at 22:34
            -   edit done at 23:19
        -   Service
            -   done at 4 april 00:14
        -   GraphQL
            -   create
            -   read
                -   done both at 1:40
            -   update
                -   done at 15:04
                -   extended (timezone) done at 15:43

[✅]
-	rooms
    -   start 4 april 21:37
    -   room types 
        -   (dao)  -done at 22:00
        -   (graphql) start 12:19 brake at 12:47 start 14:36 done 15:08
    -   room amenities 
        -   (dao) -start 5-april 11:09 done at 11:47
        -   (graphql) done at 16:01
    -   room pictures (need rooms first)
    -   rooms 
        -   defer pictures uploads
        -   for add pictures to rooms this needs to be created first
        -   (dao) start 20:30   create and delete done at 23:48 
                  completely done (with dependencies and stuff) 6 april evening
        -   (grapqhl) 
            -   create done 7 april at 16:10 brake
            -   delete start 18: 50  done 19:00 
            -   updateRoomName done 19:11
    -   room is amenities
        -   done 9 april 22:36

[✅]
-   room_locks
    -   (dao) done 16 april 1:55
        -   create
        -   delete
    -   (graphql)
        -   create [done 18 paril at 00:20]
            -   non booking
            -   for booking 
    -   get room locks [done 18 april at 00:40]
        -   (dao)   
        -   (graphql)   

[]
-   bookings
    -   define booking states done
    -  (dao)  done 16 april 1:55
       -  rooms_bookings records of the many to many
       -  clients for bookings (dao) done 16 april 1:55
       -  bookings state constanst start 19 april 19:57 done 21:00
       -  payment types done 22:00
       -  currencies done 22:23
    -   (graphql) 
        - bookings, payment_types, currencies done 23:10
    -   iterate booking schema to include cancel hanlding 
        -   start 20 april 00:15 done 2 min
        -   [done 00:53] create a payment table for the case some how a client pays for a booking and then it can be booked
    -   refactor bookings start 20 april 22:55 done :58
        -   remove 
            -   currency
            -   payment_type
    -   client payments
        -   (dao)
            -   create start 22:02 done 23:11
                -   whit and without booking reference
            -   getPayments done 00:06 10-min max
            -   (graphql)
                -   getPayments start 00:08 done 00:25
    -   Create Booking as admin 
        -   dao done 21 april 2:40
        -   graphql
    -   Cancel Booking 
        -   start 2:41 brake at 3:12
        -   restart april 21 16:41
            -   create RoomLocks/getRoomLocksByBookingId done 16:57
            -   create RoomLocks/deleteRoomLocksByBookingId start :59 done :05
            -   delete RoomBookings start :07 done :13
            -   delete client payments done :30





Note the booking service should create a booking on behalf of a client, if for some reason the client has pay but was unable to book, let's say, a room was booked just before he completed his booked, then a client payment with no booking reference must be made in order to hotel administration handle the situation






**Hot Sopt Tasks:**

Cancel Booking
    

Add Electronic type to payment_types

Delete id in db constants, use just the keys or investigate why some where correct version scope is lost

-   [done] Iterate `tb` tables to use `tsranges`
-   [done] Define `create-room-lock`  sql query
    -   `non booking`
    -   `booking`
-   [Done] 1:55
-   Create Booking and deps start(15 april 19:36)
    -   client_id (create and client) (done)
        -   Pending finish other client fns
    -   booking_state (done at 20:30)
    -   payment_type done
    -   currency (will be defered)

-   [Done] Continue Testing plpsql fn `is_room_available_in` in simple exercise
-   [Done] Rewrite fn for `tb` tables, 
    -   Concider temporal delta(free-days) bounds and other performance optimizations as index on the eventual `room_lock` `tsranges`
    -   Define test data
        -   test availability
-   Write a `available_rooms_in` that returns a record of rooms in the available date range
    -   tests it
    -   define it's indexes
-   Define `postgres.js` query to get availablity 
    -   for a particular room
    -   for every room


Done
-   Evaluate PK(room_id, booking_id) for rooms_bookings
-   Create Check Availability

    


[done]
refactor room dao
to have the acctual `room_type`
and a `room_type_key` with the `room_type` type string

RoomDAO

Investigate mapRoomRes with out fetch amenities separate
by fetching nested query of rooms_amenities.room_amenity

Iterate Spec, Dao and Grphql to use the new nested getRoomById
Variant



[Defered]
Iterate `tb-schema` tables and the code to use
Enums instead of tables in tables:
-   booking_states
-   payment_types
-   currencies
    -   user_roles
    -   room_types
    -   room_amenity

















## Notes

### Availability
Acotar busquedas de availability por intervalos maximos  del dias libres en el calendario del hotel



Useful Links
Dates Managment
Time
https://time.is/PET
Time Zones
https://nodatime.org/TimeZones

Date Convertions and stuff
`date-fns`
[`momentjs`]
https://momentjs.com/timezone/
[luxon]
https://moment.github.io/luxon/#/tour
[day.js]
https://day.js.org/



## NEW Features ideas
-   payment records