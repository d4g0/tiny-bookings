#   SQL Querys 👌️

- [SQL Querys 👌️](#sql-querys-️)
	- [Get A Client](#get-a-client)
	- [Get An Admin](#get-an-admin)
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
	- [Get Bookings](#get-bookings)
	- [Create a rooms_bookings record](#create-a-rooms_bookings-record)
	- [Get Client Payments](#get-client-payments)
	- [Get Bookings](#get-bookings-1)
	- [Create an admin (basic and full)](#create-an-admin-basic-and-full)

## Get A Client
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

## Get An Admin
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
**non-user**
```sql 
insert into
	clients (user_role, client_name, client_last_name)
values
	(3, 'Flow', 'Jhensen') RETURNING *;
```

**user**
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

## Get Bookings

```sql

```
 
## Create a rooms_bookings record
```sql
insert into
	rooms_bookings (room_id, booking_id)
values
	(229, 1) RETURNING *;
```


## Get Client Payments
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

## Get Bookings
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


## Create an admin (basic and full)
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