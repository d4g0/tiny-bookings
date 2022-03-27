## Internal Data models (Services and up layer, DAO handle db structure internals)
### ADMIN
```js
{
    user_role:          USER_ROLES.FULL_ADMIN || USER_ROLES.BASIC_ADMIN,
    admin_name:         String,
    admin_description:  String,
    hash_password:      String,
    reset_token:        String || null,
    created_at:         String (Date)

}
```