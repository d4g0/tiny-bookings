## Internal Data models 
**Services and up layer, DAO handle db structure internals**

### USER_ROLES
-   FULL_ADMIN
-   BASIC_ADMIN
-   CLIENT


### ADMIN
```js
{   
    id:                 number, // integer
    user_role:          USER_ROLES.FULL_ADMIN || USER_ROLES.BASIC_ADMIN,
    admin_name:         String,
    email:              String,
    admin_description:  String,
    hash_password:      String,
    reset_token:        String || null,
    created_at:         String (Date)

}
```