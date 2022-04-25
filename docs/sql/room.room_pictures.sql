select
	rm.id,
	rm.room_name,
	ARRAY(
		select 
			rp.filename
		from room_pictures rp
		where rp.room_id = rm.id
	) as room_pictures_filenames
from room rm 
order by rm.id