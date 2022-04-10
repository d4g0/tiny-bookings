BEGIN;
insert into user_roles ("role") values ( 'full-admin');
insert into admins ( user_role, name, description, hash_password)
values ( 1,'dago', 'system creator', 'supper-foo-hash');
end;
select * from admins;

-- composed primary keys exercise
begin;
create table room (
	id serial primary key,
	room_name varchar(30)
);

create table amenity (
	id serial primary key,
	amenity varchar(30)
);

create table rooms_amenities (
	room_id 	int REFERENCES room (id),
	amenity_id  int REFERENCES amenity (id),
	PRIMARY KEY (room_id, amenity_id)
);


end;

insert into room (room_name) values ('Blue Room');
insert into amenity (amenity) values ('Hot Top');
insert into rooms_amenities ( room_id, amenity_id ) values ( 1 , 1);

select * from rooms_amenities;