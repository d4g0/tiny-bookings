-- create table foo (
-- 	person_name character VARYING (10) not null default 'Jhonson'
-- );

-- insert into foo ( person_name , pet ) values ( 'dago', 'lila' );

-- alter table foo add column pet text not null default 'pet name';

-- select * from foo
-- create table emails (
-- id serial primary key,
-- email text unique,
-- email_owner text not null
-- );
-- select * from emails;
-- insert into emails (email, email_owner) values ('jose@mail.com','jose');
-- drop table emails;


-- test hotel

insert into hotel ( 
	hotel_name, 
	maximun_free_calendar_days,
	minimal_prev_days_to_cancel,
	check_in_hour_time,
	check_out_hour_time,
	iana_time_zone
) values (
	'Pg Hotel',
	30,
	5,
	'13:30',
	'12:00',
	'America/Lima'
)