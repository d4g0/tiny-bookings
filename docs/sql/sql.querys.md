#   SQL Querys 👌️

- [SQL Querys 👌️](#sql-querys-️)
	- [Admin](#admin)
		- [Get An Admin](#get-an-admin)
		- [Create an Admin](#create-an-admin)
			- [Simple](#simple)
			- [Production (basic and full)](#production-basic-and-full)
	- [Hotel](#hotel)
		- [Create a Hotel](#create-a-hotel)
	- [Room](#room)
		- [Create a room](#create-a-room)
			- [Basic](#basic)
			- [Production](#production)
		- [Get Room Data (by id)](#get-room-data-by-id)
		- [Get Rooms Data](#get-rooms-data)
	- [Room Picture](#room-picture)
		- [Create a room_picture](#create-a-room_picture)
		- [Delete all room is pictures](#delete-all-room-is-pictures)
	- [Room Amenity](#room-amenity)
		- [Create a room_amenity](#create-a-room_amenity)
		- [Create a rooms_amenitys record](#create-a-rooms_amenitys-record)
		- [Delete a rooms_amenities record](#delete-a-rooms_amenities-record)
		- [Delete all room is amenities](#delete-all-room-is-amenities)
	- [Room Types](#room-types)
		- [Get Room Types](#get-room-types)
		- [Create A Room Type](#create-a-room-type)
		- [Update a Room is Type](#update-a-room-is-type)
			- [Basic](#basic-1)
			- [Production](#production-1)
		- [Update a Room is Name](#update-a-room-is-name)
			- [Production](#production-2)
		- [Update a Room is Night Price](#update-a-room-is-night-price)
			- [Production](#production-3)
	- [Room Lock](#room-lock)
		- [Create a room_lock_period](#create-a-room_lock_period)
			- [Non Booking](#non-booking)
			- [With Booking](#with-booking)
		- [Delete a room](#delete-a-room)
	- [Clients](#clients)
		- [Get A Client](#get-a-client)
		- [Create a client](#create-a-client)
			- [**non-user**](#non-user)
			- [**user**](#user)
	- [Booking State](#booking-state)
		- [Create a booking state](#create-a-booking-state)
	- [Payment Type](#payment-type)
		- [Create a payment type](#create-a-payment-type)
		- [Get Client Payments](#get-client-payments)
	- [Currency](#currency)
		- [Create a currency](#create-a-currency)
	- [Booking](#booking)
		- [Create a booking](#create-a-booking)
		- [Get Bookings](#get-bookings)
	- [Room Booking record](#room-booking-record)
		- [Create a rooms_bookings record](#create-a-rooms_bookings-record)




## Admin
### Get An Admin
```sql
select 
adm.id,
ur.user_role,
adm.user_role,
adm.admin_name,
adm.admin_description,
adm.hash_password,
adm.reset_token,
adm.created_at,
adm.email
from admins adm 
join user_roles ur on( adm.user_role = ur.id)
where adm.email = 'dago@gmail.com';
```
### Create an Admin
#### Simple
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

#### Production (basic and full)
```sql
with i_adm as 
	( 
		insert into 
			admins (
				user_role,
				admin_name,
				admin_description,
				email,
				hash_password
			) 
		values (
			2,
			'fufy18',
			'outlander18',
			'fufy18@gmail.com',
			'$2a$10$qSRgLcMbPs2s6Hzl/iqCNeZYcLsDNkkWg7/2yBo0ARED0iwfV5ngu'
		) RETURNING
			admins.id,
			admins.user_role,
			admins.admin_name, 
			admins.admin_description,
			admins.email,
			admins.hash_password,
			admins.reset_token,
			admins.created_at
	) 
	select 
			i_adm.id,
			ur.user_role,
			i_adm.admin_name, 
			i_adm.admin_description,
			i_adm.email,
			i_adm.hash_password,
			i_adm.reset_token,
			i_adm.created_at
	from i_adm join user_roles ur on (i_adm.user_role = ur.id )
;

```

## Hotel
### Create a Hotel
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



## Room
### Create a room

#### Basic
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


#### Production
```sql
with i_room as 
(
	insert into
		room (
			hotel_id,
			room_name,
			night_price,
			capacity,
			number_of_beds
		)
	values
		(39, 'Blue Room foo2', 20, 2, 1) 
	returning 
		room.id
) 
select 
	rm.* 
from  i_room ir 
join get_room_data(ir.id) rm on (ir.id = rm.id)
```

### Get Room Data (by id)
```sql
select
	rm.id,
	rm.hotel_id,
	rm.room_name,
	rm.night_price,
	rm.capacity,
	rm.number_of_beds,
	rm.created_at,
	rm.room_type as room_type_id,
-- room type
	( 
		select rt.room_type from room_types rt
		where rt.id = rm.room_type
	) as room_type_key,
-- 	room pictures
	ARRAY(
		select 
			rp.id || '   ' || rp.filename
		from room_pictures rp
		where rp.room_id = rm.id
	) as room_pictures,
-- 	room amenities
	ARRAY(
		select 
		 ra.id || '   ' || ra.amenity
		from room_amenity ra join rooms_amenities rams
		on ra.id = rams.amenity_id
		where rams.room_id = rm.id
	) as room_amenities
from room rm 
where rm.id = 52
```



### Get Rooms Data
```sql
select
	rm.id,
	rm.hotel_id,
	rm.room_name,
	rm.night_price,
	rm.capacity,
	rm.number_of_beds,
	rm.created_at,
	rm.room_type as room_type_id,
-- room type
	( 
		select rt.room_type from room_types rt
		where rt.id = rm.room_type
	) as room_type_key,
-- 	room pictures
	ARRAY(
		select 
			rp.id || '   ' || rp.filename
		from room_pictures rp
		where rp.room_id = rm.id
	) as room_pictures,
-- 	room amenities
	ARRAY(
		select 
		 ra.id || '   ' || ra.amenity
		from room_amenity ra join rooms_amenities rams
		on ra.id = rams.amenity_id
		where rams.room_id = rm.id
	) as room_amenities
from room rm 
order by rm.id
```


## Room Picture
### Create a room_picture
```sql
insert into room_pictures ( room_id, filename) values (52, 'supper-foo-pic.jpg')
```
### Delete all room is pictures
```sql
delete from room_pictures rmp where rmp.room_id = 273
```

## Room Amenity
### Create a room_amenity
```sql
insert into room_amenity (amenity) values ('');
```

### Create a rooms_amenitys record
```sql
insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 1 , 1);
```

### Delete a rooms_amenities record
```sql
delete from rooms_amenities rams where rams.room_id = 52 and rams.amenity_id = 65
```

### Delete all room is amenities
```sql
delete from rooms_amenities rams where rams.room_id = 52 
```
## Room Types
### Get Room Types
```sql
select * from room_types
```

### Create A Room Type
```sql
insert into room_types ( room_type ) values ('Matrimonial')
```

### Update a Room is Type
#### Basic
```sql
update room rm set room_type = 101 where rm.id = 52
```
#### Production
```sql
with u_room as 
(
	update room 
	set room_type = 120
	where room.id = 270
	returning  room.id
		
) 
select 
	rm.* 
from  u_room ur 
join get_room_data(ur.id) rm on (ur.id = rm.id)
```

### Update a Room is Name
#### Production
```sql
with u_room as 
(
	update room 
	set room_name = 'new name'
	where room.id = 270
	returning  room.id
		
) 
select 
	rm.* 
from  u_room ur 
join get_room_data(ur.id) rm on (ur.id = rm.id)
```

### Update a Room is Night Price
#### Production
```sql
with u_room as 
(
	update room 
	set night_price = 300.50
	where room.id = 270
	returning  room.id
		
) 
select 
	rm.* 
from  u_room ur 
join get_room_data(ur.id) rm on (ur.id = rm.id)
```
## Room Lock
### Create a room_lock_period

#### Non Booking
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

#### With Booking
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

### Delete a room
```sql
delete from room rm where rm.id = 273  returning *
```

## Clients
### Get A Client
```sql
select 
cl.id,
ur.user_role,
cl.client_name,
cl.client_last_name,
cl.hash_password,
cl.email,
cl.is_email_verified,
cl.reset_token,
cl.created_at
from clients cl 
join user_roles ur on( cl.user_role = ur.id)
where cl.id = 88
```
### Create a client
#### **non-user**
```sql 
insert into
	clients (user_role, client_name, client_last_name)
values
	(3, 'Flow', 'Jhensen') RETURNING *;
```

#### **user**
```sql
with i_cli as 
	( 
		insert into 
			clients (
				user_role, 
				client_name, 
				client_last_name,
				hash_password,
				email
			) 
		values (
			(select ur.id from user_roles ur where ur.user_role = 'CLIENT'),
			'lafy',
			'gonzales',
			'$2a$10$qSRgLcMbPs2s6Hzl/iqCNeZYcLsDNkkWg7/2yBo0ARED0iwfV5ngu',
			'lafy@gmail.com'
		) RETURNING
			clients.id,
			clients.user_role,
			clients.client_name,
			clients.client_last_name,
			clients.hash_password,	
			clients.email,
			clients.is_email_verified,
			clients.reset_token,
			clients.created_at
	) 
	select 
			i_cli.id,
			ur.user_role,
			i_cli.client_name,
			i_cli.client_last_name,
			i_cli.hash_password,	
			i_cli.email,
			i_cli.is_email_verified,
			i_cli.reset_token,
			i_cli.created_at
	from i_cli join user_roles ur on (i_cli.user_role = ur.id )
;
```

## Booking State 
### Create a booking state
```sql 
insert into
	booking_states (booking_state)
values
	('Paid') RETURNING *;
```

## Payment Type
### Create a payment type
```sql
insert into
	payment_types (payment_type)
values
	('Cash') RETURNING *;
```

### Get Client Payments
```sql

select 
	*
from 
	client_payments cp
where 
	cp.effectuated_at < '2022-05-21 02:12:03'
and 
	cp.effectuated_at > '2022-02-21 02:12:03'
order by cp.effectuated_at
limit 50 offset 0

```

## Currency
### Create a currency
```sql 
insert into
	currencies (currency)
values
	('USD') RETURNING *;
```
## Booking 
### Create a booking
```sql
insert into
    booking (
        client_id,
        hotel_id,
        booking_state,
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
        60,
        '2022-04-17T00:00:00.000Z',
        '2022-04-19T00:00:00.000Z',
        2
    ) RETURNING *;
```

### Get Bookings
```sql

select 
    *
from 
    booking b
where 
    b.start_date > '2022-05-21 02:12:03'
and
    b.start_date < '2022-05-21 02:12:03'
ORDER BY b.start_date
LIMIT 50 OFFSET 0;
`;

```

## Room Booking record
### Create a rooms_bookings record
```sql
insert into
	rooms_bookings (room_id, booking_id)
values
	(229, 1) RETURNING *;
```




