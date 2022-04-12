-- create table foo (
-- 	person_name character VARYING (10) not null default 'Jhonson'
-- );
-- insert into foo ( person_name , pet ) values ( 'dago', 'lila' );
-- alter table foo add column pet text not null default 'pet name';
-- select * from foo
-- create table emails (
-- id serial primary key,
-- email text unique,
-- email_owner text not null
-- );
-- select * from emails;
-- insert into emails (email, email_owner) values ('jose@mail.com','jose');
-- drop table emails;
-- test hotel
-- Create a Hotel
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
	);

-- 
-- Create a room
-- 
insert into
	room (
		hotel_id,
		room_name,
		night_price,
		capacity,
		number_of_beds
	)
values
	(71, 'Blue Room', 20, 2, 1);

-- 
-- Create a room_lock_period
-- 
insert into
	room_lock_period (room_id, start_date, end_date, reason)
values
	(
		229,
		'2022-04-12T07:05:30.112Z',
		'2022-04-15T00:00:00.000Z',
		'Palapa planning'
	);

-- 
-- Create a client
-- 
insert into
	clients (user_role, client_name, client_last_name)
values
	(3, 'Flow', 'Jhensen');

-- 
-- Create a booking state
--
insert into
	booking_states (booking_state)
values
	('Paid');

-- 
-- Create a payment type
--
insert into
	payment_types (payment_type)
values
	('Cash');

-- 
-- Create a currency
--
insert into
	currencies (currency)
values
	('USD');

-- 
-- Create a booking
--
insert into
	booking (
		client_id,
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
		60,
		'2022-04-17T00:00:00.000Z',
		'2022-04-20T00:00:00.000Z',
		2
	);

-- 
-- Create a rooms_bookings record
--
insert into
	rooms_bookings (room_id, booking_id)
values
	(229, 1);

-- 
-- Get room_locks + rooms + room_bookings + bookings
-- 
select
	*
from
	room_lock_period rlp
	join room r on rlp.room_id = r.id
	join rooms_bookings rb on rb.room_id = r.id
	join booking b on b.id = rb.booking_id
where
	rlp.start_date > '2022-04-04T00:00:00.000Z'
	and b.start_date > '2022-04-04T00:00:00.000Z'
order by  rlp.start_date, b.start_date asc	
;