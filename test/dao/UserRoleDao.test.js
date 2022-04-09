import { createUserRole, getUserRoleByKey } from 'dao/users/UserRoleDao';
import { v4 as uuid } from 'uuid';

describe(
    'User Role Dao',
    function () {


        // create a user role
        test(
            "Create, fetch a user role",
            async function () {
                var dbError = null, USER_ROLE_KEY = uuid().substring(0, 10),
                    userRole = null, fetchedUserRole = null;
                try {
                    // create
                    userRole = await createUserRole(USER_ROLE_KEY);
                    fetchedUserRole = await getUserRoleByKey(USER_ROLE_KEY);

                    console.log({
                        userRole,
                        fetchedUserRole
                    });
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                // normal behavior
                expect(dbError).toBeNull();
                // create assertions
                expect(userRole.id).toBeDefined();
                expect(userRole.user_role).toBe(USER_ROLE_KEY);
                // fetch assertions
                expect(fetchedUserRole.id).toBe(userRole.id);
                expect(fetchedUserRole.user_role).toBe(USER_ROLE_KEY);

            }
        )
    }
)