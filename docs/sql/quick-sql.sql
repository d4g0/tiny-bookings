BEGIN;
insert into user_roles ("role") values ( 'full-admin');
insert into admins ( user_role, name, description, hash_password)
values ( 1,'dago', 'system creator', 'supper-foo-hash');
end;
select * from admins;