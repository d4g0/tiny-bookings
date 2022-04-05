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
    id: ID!
    user_role:          String!
    email:              String!
    admin_name:         String!
    admin_description:  String
    hash_password:      String!
    reset_token:        String
    created_at:         String! 
  }

  input createAdminInput {
    user_role:          USER_ROLE!
    email:              String!
    admin_name:         String!
    admin_description:  String
    password:           String!
  }



  ##
  # Client
  ##
  type Client {
    id: ID!
    name: String!
    user_role:          String!
    hash_password:      String
    reset_token:        String
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
    # room
    getRoomType(input: RoomTypeInput!): RoomType!
    getRoomTypes: [RoomType]!
  }

  ##
  # Mutation
  ##
  type Mutation {
    # admin
    createAdmin(input: createAdminInput!) : Admin!
    deleteAdmin(id: Int!): Admin!
    # hotel
    createHotel(input: HotelInput!): Hotel!
    updateHotelName(input: UpdateHotelName!): Hotel!
    updateHotelFreeCalendarDays(input: UpdateHotelFreeCalendarDays!): Hotel!
    updateHotelDaysToCancel(input: UpdateHotelDaysToCancel!): Hotel!
    updateHotelCheckIn(input: UpdateHotelCheckIn!): Hotel!
    updateHotelCheckOut(input: UpdateHotelCheckOut!): Hotel!
    updateHotelTimeZone(input: UpdateHotelTimeZone!): Hotel!
    # room
    createRoomType(input: RoomTypeInput!): RoomType!
    deleteRoomType(input: RoomTypeInput!): RoomType!
    updateRoomType(input: RoomTypeUpdateInput!): RoomType!
    
  }


  ##
  # Schema Root
  ##
  schema {
    query: Query,
    mutation: Mutation,
  }

`;

