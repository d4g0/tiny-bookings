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
    email:              String,
    admin_name:         String,
    admin_description:  String,
    hash_password:      String,
    reset_token:        String || null,
    created_at:         String (Date)
}
```
Token for admin auth
```js
  jwt_payload : {
    id,
    user_role,
    email,
    admin_name,
    created_at,
  }
```

### Creation
```js
    {
        creator_admin_id,
        user_role,
        email,
        admin_name,
        admin_description,
        password,
    }
```
Creational constrains:
Admin:
-   `password` String min(8) max(24)
-   Creator Admin `id` integer, it has to be a `FULL_ADMIN` role in db


## Auth Middleware

```js
auth: {
    isAuth: true,
    userData: {
      id: 1,
      user_role: 'FULL_ADMIN',
      email: 'tocarralero@gmail.com',
      admin_name: 'dago',
      admin_description: 'system creator',
      hash_password: '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C',
      reset_token: null,
      created_at: '2022-03-28T04:03:46.415Z',
      iat: 1648832543,
      exp: 1648839743,
      sub: '1'
    }
  }

```