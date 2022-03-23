# Arquitecture

- [Arquitecture](#arquitecture)
  - [Requirement Map](#requirement-map)
    - [General](#general)
    - [For all users types (admins, and clients)](#for-all-users-types-admins-and-clients)
    - [From client](#from-client)
    - [From admin](#from-admin)
      - [Operations Roles](#operations-roles)

## Requirement Map

### General
-	Authentication
-	Autorization

### For all users types (admins, and clients)
-   Reset their password
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

-   role: basic-admin
    -	create a hotel
    -	edit hotel data
    -	create rooms
    -	edit roooms availability (locking rooms for a time)
    -	edit rooms data
    -	create bookings
    	-	create clients (for bookings)
    -	cancel bookings
    -	list bookings
    -	list clients


-   role: full-admin
    -	[basic-admin]*
    -	create basic admin users
    -	list admins users


