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
    -	create and edit a hotel
    -	create rooms
    -	edit roooms availability (locking rooms for a time)
    -	edit rooms data
    -	create bookings
    	-	create clients (for bookings)
    -	cancel bookings
    -	list bookings
    -	list clients


-   role: `full-admin`
    -	[basic-admin]*
    -	create basic admin users    
    -	create full admin users 
    -	list admins users
    -   delete other admin users


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

[]
-	create and edit a hotel 
    -   start (3-april-11:38)
    -   create done at 22:34
    -   edit done at 23:19

