Objective:
Get all rooms of a hotel that are available in a search interval
Input: 
-   hotel_id          int!
-   delta_search_days int!
-   query_range       tsrange!
Output:
-   [rooms]



# Algor
for every `room` of the `hotel`
    if is_avalable_in(room.id, delta_search_days, query_range)
        add room to `results`
return the `results`


# Inputs
hotel_id
244
delta search days 
90
during 
'[2022-04-28 10:00:00, 2022-04-30 10:00:00]'

# Tasks
create a hotel
create a rooms for that hotel
    create bookings for those rooms

test get rooms_available_in_fn with this data

[works]
    
[brake] 21:19 [restart] 21:39
clean fn name [done] : 43
    document in functions
    include in setup
implement respective dao  binding
    twrite proper test
        create hotel, rooms, and bookings
        test for 
            scenario res when there is availability
                     res when not
