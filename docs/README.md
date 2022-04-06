# Arquitecture

- [Arquitecture](#arquitecture)
  - [Requirement Map](#requirement-map)
    - [General](#general)
    - [For all users types (admins, and clients)](#for-all-users-types-admins-and-clients)
    - [From client](#from-client)
    - [From admin](#from-admin)
      - [Operations Roles](#operations-roles)
        - [`full-admin`](#full-admin)

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
    -   reset his password
    -   recover his password by email

-   role: client
    -   search for bookings availability
    -   create a booking
    -   lis their bookings

-   role: `basic-admin`
    -	edit rooms availability (locking rooms for a time)
    -	edit rooms data
        -   create, delete and edit room types
        -   create, delete and edit room amenities
        -   create, delete and edit room pictures
    -	create bookings
    	-	create clients (for bookings)
    -	cancel bookings
    -	list bookings
    -	list clients


-   role: `full-admin`
    -	[basic-admin]*
    -	create and edit a hotel
    -	create basic admin users    
    -	create full admin users 
    -	list admins users
    -   delete other admin users
    -	create rooms


##### `full-admin`

[✅]
-   create admin users
    -   check if admin with `id` exists
    -   check if has the role `full-admin`
    -   then
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

[]
-	create rooms
    -   start 4 april 21:37
    -   room types 
        -   (dao)  -done at 22:00
        -   (graphql) start 12:19 brake at 12:47 start 14:36 done 15:08
    -   room amenities 
        -   (dao) -start 5-april 11:09 done at 11:47
        -   (graphql) done at 16:01
    -   room pictures (need rooms first)
    -   rooms start **ON THIS** start 20:30 




























Useful Links
Dates Managment
Time
https://time.is/PET
Time Zones
https://nodatime.org/TimeZones

Date Convertions and stuff
`date-fns`