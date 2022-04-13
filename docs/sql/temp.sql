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