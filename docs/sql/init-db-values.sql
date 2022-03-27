-- user roles
insert into user_roles ( user_role ) values ( 'full-admin'), ('basic-admin'), ('client');
-- db like
-- full-admin  1
-- basic-admin 2
-- client      3

-- default admin (TODO: change where deploying ok)
insert into admins (
    user_role,
    admin_name,
    admin_description,
    hash_password
 ) values (
     1,
     'dago',
     'system creator',
     '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C'
 );

 