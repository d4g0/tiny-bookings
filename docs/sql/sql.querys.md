#   SQL Querys 👌️

- [SQL Querys 👌️](#sql-querys-️)
	- [Create a Hotel](#create-a-hotel)
	- [Create a room](#create-a-room)
	- [Create a room_lock_period](#create-a-room_lock_period)
	- [Create a client](#create-a-client)
	- [Create a booking state](#create-a-booking-state)
	- [Create a payment type](#create-a-payment-type)
	- [Create a currency](#create-a-currency)
	- [Create a booking](#create-a-booking)
	- [Create a rooms_bookings record](#create-a-rooms_bookings-record)
	- [Get room_locks + rooms + room_bookings + bookings](#get-room_locks--rooms--room_bookings--bookings)
	- [get an available room for a lock or booking $s as a pair of s.start and s.end dates (bookings search)](#get-an-available-room-for-a-lock-or-booking-s-as-a-pair-of-sstart-and-send-dates-bookings-search)
		- [Test function](#test-function)
		- [Between Aproach](#between-aproach)
		- [Drop fn](#drop-fn)
		- [Query](#query)
		- [Test Values](#test-values)
		- [Stack Overflow fn](#stack-overflow-fn)
		- [Simplification exercie](#simplification-exercie)

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
	);
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
	(71, 'Blue Room', 20, 2, 1);
```

## Create a room_lock_period
```sql
insert into
	room_lock_period (room_id, start_date, end_date, reason)
values
	(
		229,
		'2022-04-12T07:05:30.112Z',
		'2022-04-15T00:00:00.000Z',
		'Palapa planning'
	);
```
 
## Create a client
```sql 
insert into
	clients (user_role, client_name, client_last_name)
values
	(3, 'Flow', 'Jhensen');
```
 
## Create a booking state
```sql 
insert into
	booking_states (booking_state)
values
	('Paid');
```
 
## Create a payment type
```sql
insert into
	payment_types (payment_type)
values
	('Cash');
```
 
## Create a currency
```sql 
insert into
	currencies (currency)
values
	('USD');
```
 
## Create a booking
```sql
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
		'2022-04-19T00:00:00.000Z',
		2
	); 
```
 
## Create a rooms_bookings record
```sql
insert into
	rooms_bookings (room_id, booking_id)
values
	(229, 1);
```
 
## Get room_locks + rooms + room_bookings + bookings
```sql 
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
order by  rlp.start_date, b.start_date asc ;
```


## get an available room for a lock or booking $s as a pair of s.start and s.end dates (bookings search)
```sql
select 
	r.id , 
	r.room_name,
from
	room r
join 
	rooms_bookings rb
	on r.id = rb.room_id
join booking b
	on b.id = rb.booking_id
where r.id = 229 
	and 
		(	
			b.start_date != 's.start'
			and
			(	
				(
					b.start_date < 's.start' and b.end_date < 's.start'
				)
				or
				(
					b.start_date > 's.start' and b.start_date > 's.end'
				)
				
			)
		)	
;
```


### Test function
```sql

create or replace function is_room_available_in( 
	room_id_filter integer, 
	s_start_date timestamp, 
	s_end_date timestamp,
	out is_available boolean
)  as $$

DECLARE

BEGIN

select into is_available exists (
	select 
	r.room_name
    from
    	room r
    join 
    	rooms_bookings rb
    	on r.id = rb.room_id
    join booking b
    	on b.id = rb.booking_id
    where r.id = room_id_filter 
    	and (	
    			b.start_date != s_start_date
    			and
    			(	
    				(
    					b.start_date < s_start_date and b.end_date < s_start_date
    				)
    				or
    				(
    					b.start_date > s_start_date and b.start_date > s_end_date
    				)
    			)
    		)	
);

END;


$$
LANGUAGE plpgsql;
```

### Between Aproach

```sql
create or replace function is_room_available_in( 
	room_id_filter integer, 
	s_start_date timestamp, 
	s_end_date timestamp,
	out is_available boolean
)  as $$

DECLARE

BEGIN

select into is_available exists (
	select 
	r.room_name
    from
    	room r
    join 
    	rooms_bookings rb
    	on r.id = rb.room_id
    join booking b
    	on b.id = rb.booking_id
    where r.id = room_id_filter 
    	and (	
    			b.start_date != s_start_date
    			and
    			(	
    				(
    					b.start_date < s_start_date and b.end_date < s_start_date
    				)
    				or
    				(
    					b.start_date > s_start_date and b.start_date > s_end_date
    				)
    			)
    		)	
);

END;
```

### Drop fn
```sql
drop function is_room_available_in
```

### Query
```sql
select is_available from is_room_available_in(
	229,
	'2022-04-16T00:00:00.000Z',
	'2022-04-18T00:00:00.000Z'
);
```

### Test Values
In a 7 days calendar, and a search for availability starting day 3 and ending day 5; 
Search s -> (3 , 5).

Should be availability if calendar is bussy in days:
-	1, 2
-	6, 7

And should not be if calendar is booked in days:
-	3, 4
-   2, 3
-   4, 6
-   5, 7


### Stack Overflow fn

[How to create a database that shows a calendar of availability for a set of apartments?](!https://stackoverflow.com/questions/24066719/how-to-create-a-database-that-shows-a-calendar-of-availability-for-a-set-of-apar)

```sql

select
 *
from
 apartments a
 where not exists 
  (select 
     1
   from 
     bookings b 
   where 
      a.apartment_id = b.apartment_id 
      and (
        <<required_start>> between booking_start and booking_end
        or
        <<required_end>> between booking_start and booking_end
        )
```


```sql

create or replace function is_t1_later (  t1 timestamp,  t2 timestamp, out is_later boolean) as $$
BEGIN
	is_later = t1 > t2;
END;
$$
LANGUAGE plpgsql;
```


### Simplification exercie

room
	id		serial
	name	varchar (20)

booking
	during  (tsrange) 

room_lock
	id      serial
	reason  varchar (20)
	during  (tsrange)


create tables
```sql
begin;
	create table room (
		id		serial PRIMARY KEY,
		name	varchar (20) not null unique
	);

	create table room_lock (
		id		serial PRIMARY KEY,
		room_id integer not null REFERENCES room (id) ,
		reason  varchar (20),
		during	tsrange
	);
end;
```

insert values
```sql
--  create a room (id will be 1)
insert into room (name) values ('Blue Room');



-- insert room_locks to test out
-- 1, 2
insert into room_lock (
room_id,
reason,
during
) values (
1,
'Booked',
'[ 2022-04-14T00:00:00.000Z, 2022-04-15T00:00:00.000Z ]'
)
```
inserted locks ranges
'[ 2022-04-14T00:00:00.000Z, 2022-04-15T00:00:00.000Z ]'
'[ 2022-04-19T00:00:00.000Z, 2022-04-21T00:00:00.000Z ]'
'[ 2022-04-25T00:00:00.000Z, 2022-04-27T00:00:00.000Z ]'

expected true for
'[ 2022-04-16T00:00:00.000Z, 2022-04-28T00:00:00.000Z ]'

availability fn
```sql
create or replace function is_room_available_in( 
	room_id_filter integer,
	query_range tsrange,
	out is_available boolean
) as $$
DECLARE

temp_lock RECORD;

BEGIN

is_available = true;

-- loop in bounded by x offset locks
	-- if current tsrange overlaps with query range
		-- is_available = false
		-- stop loop
for temp_lock in 
	select during from room_lock where room_lock.room_id = room_id_filter
loop
	if query_range && temp_lock.during then
		is_available = false;
		EXIT;
	end if;

end loop;
END;
$$
LANGUAGE plpgsql;
```
