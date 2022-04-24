
BEGIN;
CREATE INDEX admin_email_idx on admins USING BTREE (email);
CREATE INDEX client_email_idx on clients USING BTREE (email);
CREATE INDEX booking_start_date_idx on booking USING BTREE (start_date);
CREATE INDEX lock_period_start_date_idx on room_lock_period USING BTREE (start_date);
CREATE INDEX lock_period_during_idx ON room_lock_period USING GIST (during);
CREATE INDEX lock_period_booking_idx ON room_lock_period USING BTREE (booking_id);
CREATE INDEX client_payments_effectuated_at_idx on client_payments USING BTREE (effectuated_at);
CREATE INDEX client_payments_booking_reference_idx on client_payments USING BTREE (booking_reference);
CREATE INDEX client_created_at_idx on clients USING BTREE (created_at);
END;