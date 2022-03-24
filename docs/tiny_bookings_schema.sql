CREATE TYPE "user_role" AS ENUM (
  'full_admin',
  'admin',
  'client'
);

CREATE TYPE "payment_type" AS ENUM (
  'in_site_electronic',
  'cash'
);

CREATE TYPE "booking_state" AS ENUM (
  'payment_pending',
  'payed',
  'canceled'
);

CREATE TABLE "admin" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(60),
  "email" varchar(60) UNIQUE,
  "hash_password" text,
  "reset_token" text,
  "role" user_role,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "client" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(60),
  "email" varchar(60) UNIQUE,
  "hash_password" text,
  "reset_token" text,
  "role" user_role,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "hotel" (
  "id" SERIAL PRIMARY KEY,
  "hote_name" text,
  "maximun_free_calendar_days" int,
  "check_in_hour_time" timestamp,
  "check_out_hour_time" timestamp,
  "minimal_prev_days_to_cancel" int,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "room" (
  "id" SERIAL PRIMARY KEY,
  "hotel_id" int,
  "name" varchar(60),
  "price" numeric,
  "capacity" int,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "amenitiy" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(60)
);

CREATE TABLE "room_amenities" (
  "room_id" int,
  "amenitiy_id" int
);

CREATE TABLE "room_pictures" (
  "id" SERIAL PRIMARY KEY,
  "room_id" int,
  "filename" text
);

CREATE TABLE "booking" (
  "id" SERIAL PRIMARY KEY,
  "total_bill" numeric,
  "check_in_date" timestamp,
  "check_out_date" timestamp,
  "client_id" int,
  "capacity" int,
  "payment_type" payment_type,
  "booking_state" booking_state,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "rooms_bookings" (
  "booking_id" int,
  "room_id" int
);

ALTER TABLE "room" ADD FOREIGN KEY ("hotel_id") REFERENCES "hotel" ("id");

ALTER TABLE "room_amenities" ADD FOREIGN KEY ("room_id") REFERENCES "room" ("id");

ALTER TABLE "room_amenities" ADD FOREIGN KEY ("amenitiy_id") REFERENCES "amenitiy" ("id");

ALTER TABLE "room_pictures" ADD FOREIGN KEY ("room_id") REFERENCES "room" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("client_id") REFERENCES "client" ("id");

ALTER TABLE "rooms_bookings" ADD FOREIGN KEY ("booking_id") REFERENCES "booking" ("id");

ALTER TABLE "rooms_bookings" ADD FOREIGN KEY ("room_id") REFERENCES "room" ("id");