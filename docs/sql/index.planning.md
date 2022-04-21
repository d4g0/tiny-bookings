# Index Planning

Operation wish handle a lot of records

-   Login
    -   tables
        -   clients
        -   admins
    -   fields
        -   email
        
-   get bookings
    -   tables
        -   booking
    -   fields
        -   start_date
        
-   get room_lock_period
    -   tables
        -   room_lock_period
    -   fields
        -   start_date
        -   during
        -   booking_id
-   list client payments
    -   tables
        -   client_payments
    -   fields
        -   effectuated_at

## Indexes

### Login

#### Admins
email
```sql
CREATE INDEX admin_email_idx on admins USING BTREE (email)
```
#### Clients
email
```sql
CREATE INDEX client_email_idx on clients USING BTREE (email)
```

## Get Bookings
start_date
```sql
CREATE INDEX booking_start_date_idx on booking USING BTREE (start_date)
```
## Get Room Lock Periods
start_date
```sql
CREATE INDEX lock_period_start_date_idx on room_lock_period USING BTREE (start_date)
```
during
```sql
CREATE INDEX lock_period_during_idx ON room_lock_period USING GIST (during);
```

booking_id
```sql
CREATE INDEX lock_period_booking_idx ON room_lock_period USING BTREE (booking_id);
```

## Client Payments
effectuated_at
```sql
CREATE INDEX client_payments_effectuated_at_idx on client_payments USING BTREE (effectuated_at);
```

##