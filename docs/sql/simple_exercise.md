# This exercise was made to  learn about the `tsrange` postgresql feature and craft an precise `availability` query with it


## Stack Overflow fn notice
[How to create a database that shows a calendar of availability for a set of apartments?](!https://stackoverflow.com/questions/24066719/how-to-create-a-database-that-shows-a-calendar-of-availability-for-a-set-of-apar)

## Model
room
	id		serial
	name	varchar (20)


room_lock
	id      serial
	reason  varchar (20)
	during  (tsrange)


## create tables
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
## inserted locks ranges
'[ 2022-04-15T00:00:00.000Z, 2022-04-16T00:00:00.000Z ]'
'[ 2022-04-19T00:00:00.000Z, 2022-04-21T00:00:00.000Z ]'
'[ 2022-04-25T00:00:00.000Z, 2022-04-27T00:00:00.000Z ]'

expected true for
'[ 2022-04-16T00:00:00.000Z, 2022-04-28T00:00:00.000Z ]'




## Availability fn
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