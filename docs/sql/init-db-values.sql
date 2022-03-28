-- user roles
insert into user_roles ( user_role ) values ( 'FULL_ADMIN'), ('BASIC_ADMIN'), ('CLIENT');
-- db like
-- FULL_ADMIN  1
-- BASIC_ADMIN 2
-- CLIENT      3

-- default admin (TODO: change where deploying ok)
insert into admins (
    user_role,
    admin_name,
    email,
    admin_description,
    hash_password
 ) values (
     1,
     'dago',
     'tocarralero@gmail.com',
     'system creator',
     '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C'
 );

 