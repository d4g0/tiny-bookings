# SQL Functions 

## Check a room is availability
```sql
create or replace function is_room_available_in( 
	room_id_filter integer,
    delta_search_days integer,
	query_range tsrange,
	out is_available boolean
) as $$

DECLARE
temp_lock RECORD;
current_utc_date date = current_date at time zone 'UTC';
latest_date_to_search date = current_utc_date - ( delta_search_days + 1);

BEGIN
is_available = true;

for temp_lock in 
	select 
            * 
        from 
            room_lock_period rlp 
        where rlp.room_id = room_id_filter and rlp.start_date > latest_date_to_search
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

### Query 
```sql
select is_available from is_room_available_in (1, 30, '[2022-04-15T00:00:00.000Z, 2022-04-16T00:00:00.000Z ]')
```


### Create tsrange string (Not Used)
```sql
create or replace function make_tsrange_str(start_date timestamp, end_date timestamp, out tsrange_str text) as $$
	begin
	tsrange_str = '['||start_date||' , '||end_date||']';
	end;
$$
Language plpgsql;
```
##### Query
```sql
select make_tsrange_str('2022-04-15T00:00:00.000Z','2022-04-16T00:00:00.000Z')
```

### Availability variant (Not Used)
```sql
create or replace function is_room_available_in_2( 
	room_id_filter integer,
    delta_search_days integer,
	start_date date,
	end_date date,
	out is_available boolean
) as $$

DECLARE
temp_lock RECORD;
current_utc_date date = current_date at time zone 'UTC';
latest_date_to_search date = current_utc_date - ( delta_search_days + 1);
query_range tsrange = make_tsrange_str(start_date, end_date);

BEGIN
is_available = true;

for temp_lock in 
	select 
            * 
        from 
            room_lock_period rlp 
        where rlp.room_id = room_id_filter and rlp.start_date > latest_date_to_search
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