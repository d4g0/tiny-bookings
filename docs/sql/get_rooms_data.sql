select
	rm.id,
	rm.hotel_id,
	rm.room_name,
	rm.night_price,
	rm.capacity,
	rm.number_of_beds,
	rm.created_at,
-- room type
	( 
		select rt.room_type from room_types rt
		where rt.id = rm.room_type
	) as room_type,
-- 	room pictures
	ARRAY(
		select 
			rp.filename
		from room_pictures rp
		where rp.room_id = rm.id
	) as room_pictures_filenames,
-- 	room amenities
	ARRAY(
		select ra.amenity
		from room_amenity ra join rooms_amenities rams
		on ra.id = rams.amenity_id
		where rams.room_id = rm.id
	) as room_amenities
from room rm 
order by rm.id