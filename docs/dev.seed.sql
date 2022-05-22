BEGIN;

-- hotel
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
		90,
		5,
		'13:30',
		'12:00',
		'America/Lima'
	);


-- room type
-- 1
insert into room_types ( room_type ) values ('Matrimonial');
-- 2
insert into room_types ( room_type ) values ('Triple');
-- 3
-- insert into room_types ( room_type ) values ('Cuadruple');

-- amenities
-- 1
insert into room_amenity (amenity) values ('TV');
-- 2
insert into room_amenity (amenity) values ('Aire Acondicionado');


-- rooms
-- room 1
insert into
	room (
		hotel_id,
		room_name,
		night_price,
		capacity,
		number_of_beds
	)
values
	(1, '101', 50, 2, 1);

-- type
update room rm set room_type = 1 where rm.id = 1;

-- amenities
insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 1 , 1);

insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 1 , 2);

-- pics
insert into room_pictures ( room_id, filename) values (1, '27.jpg');
 


-- room 2
insert into
	room (
		hotel_id,
		room_name,
		night_price,
		capacity,
		number_of_beds
	)
values
	(1, '102', 60, 3, 3);

-- type
update room rm set room_type = 2 where rm.id = 2;

-- amenities
insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 2 , 1);

insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 2 , 2);

-- pics
insert into room_pictures ( room_id, filename) values (2, '13.jpg');


-- room 3
insert into
	room (
		hotel_id,
		room_name,
		night_price,
		capacity,
		number_of_beds
	)
values
	(1, '103', 50, 2, 1);

-- type
update room rm set room_type = 1 where rm.id = 3;

-- amenities
insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 3 , 1);

insert into rooms_amenities (
	room_id,
	amenity_id
) values ( 3 , 2);

-- pics
insert into room_pictures ( room_id, filename) values (3, '28.jpg');


END;