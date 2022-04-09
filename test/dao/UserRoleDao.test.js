import { createUserRole } from 'dao/users/UserRoleDao';
import { v4 as uuid } from 'uuid';

describe(
    'User Role Dao',
    function () {


        // create a user role
        test(
            "Create a user role",
            async function () {
                var dbError = null, USER_ROLE_KEY = uuid().substring(0, 10), userRole = null;
                try {
                    userRole = await createUserRole(USER_ROLE_KEY);
                    console.log({ userRole });
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                expect(dbError).toBeNull();
                expect(userRole.id).toBeDefined();
                expect(userRole.user_role).toBe(USER_ROLE_KEY);
            }
        )
    }
)