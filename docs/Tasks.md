#   Tasks

23/march/22 (18:53)
-   set up db
-   set up express basic + apollo graphql
-   users crud service
    -   login
-   autentication + authorization on users models

## set up db
-  done 24/march/22


## users crud service
- login 
- start 24-march-22-18:48
- study how works the prisma client
 - create a singleton for lon running processeces (nodejs api on vps)
 - create connect and disconnect functions to manage in the app flow 
 - (24/19:32)
- create user dao (work-pause start again at 23:18)
 - full admin
   - create user
   - retrive user 
   - delete admin 
     completed (27-march-05:27) then toke a pause
   
 - client with email
   - pending
 - client with name
   - pending
 - 
- setup basic express and graphql
- define create admin api
 - set up basic graphql models and resolvers
- define login
 - enabled for full admins
 - enabled for full basic-admins
 - enabled for full clients
- Define cross API Errors in Spec (tray to keep errors in services, and propagate from there)
- Define Graphql directives 
- Api Logs 
 - Study pino https://www.twilio.com/blog/guide-node-js-logging
- Learn about POSTGRES_Indexes

    

## set up express basic + apollo graphql
start 27-march-6:17
basic express done by 7:30 then brake
restart working 9:30
basic graphql setup by 11:25 brake
start 28-march-01:10
basic done at some point before 5:30

## define create admin api 
start 6:00
refactor createFullAdmin into createAdmin dao.fn by 7:00 (test refactor included) brake
start 7:34
createAdminService
  refactor to not check admin in db, trust in params instead, since it should be protected by `auth`
validation 8:43
brake at 8:53
start march 30 - 2:00
done 4:31 break

## define loging
start 12:48
union types and query handling on those
basic get admin by email n password | break 14:02
start 15:36
pending clients

## Define cross API Errors
Start 
2/april - 11:00
brake to watch fm graphql course
Done 3 april at some point in the morning

## Refactor graphql to separation of concerns patters
start
2/april - 14:53
- login
### Auths to inside context
- authentication
- authorization
  - Done 2-april-17:00

## Create a Hotel
- start (3-april-11:38)
- Define check in times arrangment treatment
- Add Time Zone

## Create Rooms
-  Define date and time schema to match local time

