import gql from 'graphql-tag';

export const typeDefinitions = gql`

  ##
  # Generals
  ##
  enum USER_ROLE {
    FULL_ADMIN
    BASIC_ADMIN
    CLIENT
  }



  ##
  # ADMIN
  ##
  type Admin {
    id:                 ID!
    user_role:          String!
    email:              String!
    admin_name:         String!
    admin_description:  String
    hash_password:      String!
    created_at:         String! 
  }

  input CreateAdminInput {
    user_role_id:       Int!
    email:              String!
    admin_name:         String!
    admin_description:  String
    password:           String!
  }

  type DelAdminResult {
    completed:         Boolean!
    count:             Int!
  }

  ##
  # Client
  ##
  type Client {
    id:                 ID!
    client_name:        String!
    client_last_name:   String!
    user_role:          String!
    email:              String
    hash_password:      String
    created_at:         String!
  }


  ##
  # Login
  ##

  input loginInput {
    email:              String!
    password:           String!
  }

  union User = Admin | Client

  type Auth {
    user:               User!
    token:              String!
    token_created_at:   String!
  }




  ##
  # Hotel
  ##

  type Hotel {
    id:                           ID!
    hotel_name:                   String!
    maximun_free_calendar_days:   Int!
    check_in_hour_time:           String!
    check_out_hour_time:          String!
    minimal_prev_days_to_cancel:  Int!
    iana_time_zone:               String!
  }

  input HourTime {
    hours:                        Int!
    mins:                         Int!
  }

  input HotelInput {
    hotel_name:                   String!
    maximun_free_calendar_days:   Int!
    minimal_prev_days_to_cancel:  Int!
    check_in_hour_time:           HourTime!
    check_out_hour_time:          HourTime!
    iana_time_zone:               String!
  }

  input getHotelInput {
    id: Int!
  }

  
  input UpdateHotelName {
    hotel_id:                     Int!
    hotel_name:                   String!
  }

  input UpdateHotelFreeCalendarDays {
    hotel_id:                     Int!
    maximun_free_calendar_days:   Int!
  }

  input UpdateHotelDaysToCancel {
    hotel_id:                     Int!
    minimal_prev_days_to_cancel:   Int!
  }

  input UpdateHotelCheckIn {
    hotel_id:                     Int!
    check_in_hour_time:           HourTime!
  }

  input UpdateHotelCheckOut {
    hotel_id:                     Int!
    check_out_hour_time:           HourTime!
  }

  input UpdateHotelTimeZone {
    hotel_id:                     Int!
    iana_time_zone:               String!
  }



  ##
  # Rooms
  ##
  # RoomType
  type RoomType {
    id:               Int!
    room_type:        String!
  }

  input RoomTypeInput {
    room_type:        String!
  }

  input RoomTypeUpdateInput {
    room_type:        String!
    new_room_type:    String!
  }
  

  # RoomAmenity
  type RoomAmenity {
    id:               Int!
    amenity:          String!
  }

  input RoomAmenityInput {
    amenity:          String!
  }

  input RoomAmenityUpdateInput {
    amenity:          String!
    new_amenity:      String!
  }

  # Room Picture
  type RoomPicture{
    id:               Int!
    room_id:          Int!
    filename:         String!
  }

  # Room Is Amenity (many-to-many)
  type RoomIsAmenity {
    room_id:          Int!
    amenity_id:       Int!
  }

  type DelRoomIsAmenityRes {
    count:            Int!
  }

  input DeleteARoomIsAmenityInput{
    room_id:               Int!
    amenity_id:            Int!
  }

  input CreateARoomIsAmenityInput{
    room_id:          Int!
    amenity_id:       Int!
  }

  type RoomIsAmenityWithAmenity {
    room_id:          Int!
    amenity_id:       Int!
    room_amenity:     RoomAmenity!
  }

  # Room
  type Room {
    id:               Int!
    hotel_id:         Int!
    room_name:        String!
    night_price:      Float!
    capacity:         Int!
    number_of_beds:   Int!
    created_at:       String!
    room_type:        Int
    room_types:       RoomType
    room_pictures:    [RoomPicture]!
    rooms_amenities:  [RoomIsAmenityWithAmenity]!
  }

  
  # inputs
  input CreateRoomInput {
    hotel_id:         Int!
    room_name:        String!
    night_price:      Float!
    capacity:         Int!
    number_of_beds:   Int!
  }

  input DeleteRoomInput {
    room_id:          Int!
  }

  input UpdateRoomNameInput {
    room_id:          Int!
    room_name:        String!
  }

  input UpdateRoomIsTypeInput {
    room_id:          Int!
    room_type_id:     Int!
  }

  input UpdateRoomNightPriceInput {
    room_id:          Int!
    new_night_price:  Float!
  }
  
  input UpdateRoomCapacityInput {
    room_id:          Int!
    new_capacity:     Int!
  }

  input UpdateRoomNumberOfBedsInput {
    room_id:                Int!
    new_number_of_beds:     Int!
  }

  # Room Lock Period
  type RoomLockPeriod {
    id:                   Int!
    room_id:              Int!
    start_date:           String!
    end_date:             String!
    reason:               String!
    created_at:           String!
    is_a_booking:         Boolean!
    during:               String!
    booking_id:           Int
  }

  type RoomLocksResult {
    results:              [RoomLockPeriod]!
    count:                Int!
  }
  
  # inputs
  input createRoomLockInput {
    room_id:                Int!
    reason:                 String
    start_date:             DateObject!
    end_date:               DateObject! 
    hotel_calendar_length:  Int!
    is_a_booking:           Boolean!
    booking_id:             Int
  }

  input DateObject {
    year:                   Int!
    month:                  Int!
    day:                    Int!
    hour:                   Int!
    minute:                 Int!
  }

  input GetRoomLocksInput {
    start_date_filter:      DateObject!  
    end_date_filter:        DateObject!
    page:                   Int!
  }

  input GetARoomIsLocksInput {
    start_date_filter:      DateObject!  
    end_date_filter:        DateObject!
    page:                   Int!
    room_id_filter:         Int!
    
  }

  # Payment Types

  type PaymentType {
    id:                     Int!
    payment_type:           String!
  }

  # Booking State
  type BookingState {
    id:                     Int!
    booking_state:          String!
  }


  # Currencies
  type Currencies {
    id:                     Int!
    currency:               String!
  }

  # Client Payment
  type ClientPayment {
    id:                     Int!
    client_id:              Int!
    amount:                 Float!
    booking_reference:      Int
    payment_type:           Int!
    currency:               Int!
    effectuated_at:         String!
  }

  type ClientPaymentsResult{
    results:                [ClientPayment]!
    count:                  Int!
  }

  input GetClientPaymentsInput {
    start_date_filter:      DateObject!  
    end_date_filter:        DateObject!
    page:                   Int!
  }

  # Booking
  type Booking {
    id:                     Int!
    client_id:              Int!
    hotel_id:               Int!
    booking_state:          Int!
    total_price:            Float!
    start_date:             String!
    end_date:               String!
    number_of_guests:       Int!
    is_cancel:              Boolean!
    created_at:             String!
  }

  # input
  input createBookingAsAdmin {
    start_date:             DateObject!
    end_date:               DateObject!
    rooms_ids:              [Int]!
    hotel_id:               Int!
    hotel_calendar_length:  Int!
    client_name:            String!
    client_last_name:       String!
    total_price:            Float!
    payment_type_id:        Int!
    currency_id:            Int!
    number_of_guests:       Int!
  }

  input GetBookingsInput {
    start_date_filter:      DateObject!  
    end_date_filter:        DateObject!
    page:                   Int!
  }

  type BookingsResult {
    results:                [Booking]!
    count:                  Int!
  }

  input SingUpInput {
    client_name:            String!
    client_last_name:       String!
    password:               String!
    email:                  String!
  }

  ##
  # Query
  ##
  type Query {
    # login
    login(input: loginInput!): Auth!
    # admin
    admins: [Admin]!
    # hotel
    hotel(input: getHotelInput!): Hotel!
    hotels: [Hotel]!
    # room
    # roomType
    getRoomType(input: RoomTypeInput!): RoomType!
    getRoomTypes: [RoomType]!
    # roomAmenity
    getRoomAmenity(input: RoomAmenityInput!): RoomAmenity!
    getRoomAmenities: [RoomAmenity]!
    room(room_id: Int!): Room!
    rooms: [Room]!
    # room locks
    getRoomLocks(input: GetRoomLocksInput!): RoomLocksResult!
    getARoomIsLocks(input: GetARoomIsLocksInput!): RoomLocksResult!
    # payment types
    getPaymentTypes: [PaymentType]!
    # booking states
    getBookingStates: [BookingState]!
    # currencies
    getCurrencies: [Currencies]!
    # client payments
    getClientPayments(input: GetClientPaymentsInput!): ClientPaymentsResult!
    # bookings
    getBookings(input: GetBookingsInput!): BookingsResult!
    getClientBookingsAsClient(input: GetBookingsInput!): BookingsResult!
  }

  ##
  # Mutation
  ##
  type Mutation {
    # admin
    createAdmin(input: CreateAdminInput!) : Admin!
    deleteAdmin(id: Int!): DelAdminResult!
    # hotel
    createHotel(input: HotelInput!): Hotel!
    updateHotelName(input: UpdateHotelName!): Hotel!
    updateHotelFreeCalendarDays(input: UpdateHotelFreeCalendarDays!): Hotel!
    updateHotelDaysToCancel(input: UpdateHotelDaysToCancel!): Hotel!
    updateHotelCheckIn(input: UpdateHotelCheckIn!): Hotel!
    updateHotelCheckOut(input: UpdateHotelCheckOut!): Hotel!
    updateHotelTimeZone(input: UpdateHotelTimeZone!): Hotel!
    ##
    # rooms
    ##
    # roomType
    createRoomType(input: RoomTypeInput!): RoomType!
    deleteRoomType(input: RoomTypeInput!): RoomType!
    updateRoomType(input: RoomTypeUpdateInput!): RoomType!
    # roomAmenity
    createRoomAmenity(input: RoomAmenityInput!): RoomAmenity!
    updateRoomAmenity(input: RoomAmenityUpdateInput!): RoomAmenity!
    deleteRoomAmenity(input: RoomAmenityInput!): RoomAmenity!
    createARoomIsAmenity(input: CreateARoomIsAmenityInput!): RoomIsAmenity!
    deleteARoomIsAmenity(input: DeleteARoomIsAmenityInput!): DelRoomIsAmenityRes!
    # room
    createRoom(input: CreateRoomInput!): Room!
    deleteRoom(input: DeleteRoomInput!): Room!
    updateRoomName(input: UpdateRoomNameInput!): Room!
    updateARoomIsType(input: UpdateRoomIsTypeInput!): Room!
    updateRoomNightPrice(input: UpdateRoomNightPriceInput!): Room!
    updateRoomCapacity(input: UpdateRoomCapacityInput!): Room!
    updateRoomNumberOfBeds(input: UpdateRoomNumberOfBedsInput!): Room!
    # room lock period
    createARoomLockPeriod(input: createRoomLockInput!): RoomLockPeriod!
    # bookings
    createBookingAsAdmin(input: createBookingAsAdmin!): Booking!
    cancelBooking(bookingId: Int!): Booking!
    # singup
    singUp(input: SingUpInput!): Auth!
  }


  ##
  # Schema Root
  ##
  schema {
    query: Query,
    mutation: Mutation,
  }

`;

