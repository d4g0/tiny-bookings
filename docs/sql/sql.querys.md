#   SQL Querys 👌️

- [SQL Querys 👌️](#sql-querys-️)
	- [Create an Admin](#create-an-admin)
	- [Create a Hotel](#create-a-hotel)
	- [Create a room_amenity](#create-a-room_amenity)
	- [Create a rooms_amenitys record](#create-a-rooms_amenitys-record)
	- [Create a room](#create-a-room)
	- [Create a room_lock_period](#create-a-room_lock_period)
		- [Non Booking](#non-booking)
		- [With Booking](#with-booking)
	- [Create a client](#create-a-client)
	- [Create a booking state](#create-a-booking-state)
	- [Create a payment type](#create-a-payment-type)
	- [Create a currency](#create-a-currency)
	- [Create a booking](#create-a-booking)
	- [Create a rooms_bookings record](#create-a-rooms_bookings-record)


## Create an Admin
```sql
insert into 
	admins (
		user_role,
		admin_name,
		admin_description,
		email,
		hash_password
	)
values (
	1,
	'dago',
	'system creator',
	'dago@gmail.com',
	'$2a$10$qSRgLcMbPs2s6Hzl/iqCNeZYcLsDNkkWg7/2yBo0ARED0iwfV5ngu'
) RETURNING *;
```
## Create a Hotel
```sql
insert into
	hotel (
		hotel_name,
		maximun_free_calendar_days,
		minimal_prev_days_to_cancel,
		check_in_hour_time,
		check_out_hour_time,
		iana_time_zone
	)
values
	(
		'Pg Hotel',
		30,
		5,
		'13:30',
		'12:00',
		'America/Lima'
	) returning *;
```
## Create a room_amenity
```sql
insert into room_amenity (amenity) values ('');
```

## Create a rooms_amenitys record
```sql
insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 1 , 1);
```
## Create a room
```sql
insert into
	room (
		hotel_id,
		room_name,
		night_price,
		capacity,
		number_of_beds
	)
values
	(1, 'Blue Room', 20, 2, 1);
```

## Create a room_lock_period

### Non Booking
```sql
insert into
	room_lock_period (
		room_id, 
		start_date, 
		end_date, 
		reason,
		during
	)
values
	(
		1,
		'2022-04-15T00:00:00.000Z',
		'2022-04-16T00:00:00.000Z',
		'Palapa planning',
		'[2022-04-15T00:00:00.000Z, 2022-04-16T00:00:00.000Z]'
	);
```

### With Booking
```sql
insert into
	room_lock_period (
		room_id,
		start_date,
		end_date,
		reason,
		during,
		is_a_booking,
		booking_id
	)
values
	(
		20,
		'2022-04-17 00:00:00',
		'2022-04-19 00:00:00',
		'Booked',
		'[2022-04-17 00:00:00, 2022-04-19 00:00:00]',
		true,
		1
	) RETURNING *;
```
 
## Create a client
```sql 
insert into
	clients (user_role, client_name, client_last_name)
values
	(3, 'Flow', 'Jhensen') RETURNING *;
```
 
## Create a booking state
```sql 
insert into
	booking_states (booking_state)
values
	('Paid') RETURNING *;
```
 
## Create a payment type
```sql
insert into
	payment_types (payment_type)
values
	('Cash') RETURNING *;
```
 
## Create a currency
```sql 
insert into
	currencies (currency)
values
	('USD') RETURNING *;
```
 
## Create a booking
```sql
insert into
    booking (
        client_id,
        hotel_id,
        booking_state,
        payment_type,
        currency,
        total_price,
        start_date,
        end_date,
        number_of_guests
    )
values
    (
        1,
        1,
        1,
        1,
        1,
        60,
        '2022-04-17T00:00:00.000Z',
        '2022-04-19T00:00:00.000Z',
        2
    ) RETURNING *;
```
 
## Create a rooms_bookings record
```sql
insert into
	rooms_bookings (room_id, booking_id)
values
	(229, 1) RETURNING *;
```
