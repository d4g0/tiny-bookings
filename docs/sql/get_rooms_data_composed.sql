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
			rp.id || ' ' || rp.filename
		from room_pictures rp
		where rp.room_id = rm.id
	) as room_pictures,
-- 	room amenities
	ARRAY(
		select 
		 ra.id || ' ' || ra.amenity
		from room_amenity ra join rooms_amenities rams
		on ra.id = rams.amenity_id
		where rams.room_id = rm.id
	) as room_amenities
from room rm 
order by rm.id