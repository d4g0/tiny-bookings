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
  - end   
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
      
    - basic admin
      - pending
    - client with email
      - pending
    - client with name
      - pending
    - 
  - setup basic express and graphql
  - define create admin api
  - 
  - define login
    - enabled for full admins
    - enabled for full basic-admins
    - enabled for full clients

    

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
validation 8:43
brake at 8:53