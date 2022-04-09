import { createUserRole, deleteUserRole, getUserRoleByKey } from 'dao/users/UserRoleDao';
import { v4 as uuid } from 'uuid';

describe(
    'User Role Dao',
    function () {


        // create a user role
        test(
            "Create, fetch and delete a user role",
            async function () {
                var dbError = null, USER_ROLE_KEY = uuid().substring(0, 10),
                    userRole = null, fetchedUserRole = null, delUserRole = null;
                try {
                    // create
                    userRole = await createUserRole(USER_ROLE_KEY);
                    // read
                    fetchedUserRole = await getUserRoleByKey(USER_ROLE_KEY);
                    // delete
                    delUserRole = await deleteUserRole(USER_ROLE_KEY);

                    console.log({
                        userRole,
                        fetchedUserRole,
                        delUserRole
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
                // delete assertions
                expect(delUserRole.id).toBe(userRole.id);
                expect(delUserRole.user_role).toBe(USER_ROLE_KEY);

            }
        )

        test(
            "Test Get Res when querying for a non existing user role",
            async function () {
                var dbError = null, userRole = null, RANDOM_KEY = uuid().substring(0, 10);

                try {
                    userRole = await getUserRoleByKey(RANDOM_KEY);
                    console.log({
                        userRole
                    });
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }
                // normal behavior
                expect(dbError).toBeNull()
                // assertions
                expect(userRole).toBeNull();
            }
        )
    }
)