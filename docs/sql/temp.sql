-- 	room data
select 
	rm.id,
	rm.hotel_id,
	rm.room_name,
	rm.night_price,
	rm.capacity,
	rm.number_of_beds,
	rm.created_at,
	rm.room_type
from room rm 
where rm.id = 52

-- room type
select 
	rt.id as room_type_id,
	rt.room_type as room_type
from room_types rt full join room rm on (rt.id = rm.room_type)
where rm.id = 52


-- room amenities
select 
	rams.amenity_id as amenity_id,
	ram.amenity as amenity
from rooms_amenities rams
full join room rm on (rm.id = rams.room_id)
full join room_amenity ram on (rams.amenity_id = ram.id)
where rm.id = 52


--  room pictures
select 
	rp.id as room_picture_id,
 	rp.filename as room_picture_filename
from room_pictures rp
join room rm on (rp.room_id = rm.id)
where rm.id = 52



create or replace function get_room_data_by_id( 
	room_id_filter integer ) 
	returns room TABLE, room_pictures
