// This constans shoul be fullfiled in the data-base, 
// in the precise same order as in the `init-db-values.sql` file
// 
export const USER_ROLES = {
    'FULL_ADMIN': {
        id: 1,
        user_role: 'FULL_ADMIN'
    },
    'BASIC_ADMIN': {
        id: 2,
        user_role: 'BASIC_ADMIN'
    },
    'CLIENT': {
        id: 3,
        user_role: 'CLIENT'
    }
}

export const USER_ROLES_LIST = [
    USER_ROLES.FULL_ADMIN,
    USER_ROLES.BASIC_ADMIN,
    USER_ROLES.CLIENT
]
