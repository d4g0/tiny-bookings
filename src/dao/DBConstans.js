// This constans shoul be fullfiled in the data-base, 
// in the precise same order as in the `init-db-values.sql` file
// 
export const USER_ROLES = {
    'FULL_ADMIN': {
        id: 1,
        user_role: 'full-admmin'
    },
    'BASIC_ADMIN': {
        id: 2,
        user_role: 'basic-admmin'
    },
    'CLIENT': {
        id: 3,
        user_role: 'client'
    }
}

export const USER_ROLES_LIST = [
    USER_ROLES.FULL_ADMIN,
    USER_ROLES.BASIC_ADMIN,
    USER_ROLES.CLIENT
]
