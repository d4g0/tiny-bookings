import { getUserRoleId, USER_ROLES } from 'dao/DBConstans';
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
            "Test when fetching  for a non existing user role",
            async function () {
                var dbError = null,
                    userRole = null,
                    RANDOM_KEY = uuid().substring(0, 10);

                try {
                    userRole = await getUserRoleByKey(RANDOM_KEY);
                    console.log({
                        userRole,
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


        test(
            "Test when deleting for a non existing user role",
            async function () {
                var dbError = null,
                    RANDOM_KEY = uuid().substring(0, 10);

                try {
                    await deleteUserRole(RANDOM_KEY);
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }
                // normal behavior
                expect(dbError).toBeDefined()
                // assertions
                expect(dbError.code).toBe('P2025');// prisma error code
            }
        )

        // test initUserRoles Secuence
        test(
            "Init UserRoles secuence",
            async function () {
                var dbError = null;
                var fullAdminRole = null, basicAdminRole = null, clientRole = null;

                try {
                    fullAdminRole = await getUserRoleByKey(USER_ROLES.FULL_ADMIN.user_role);
                    basicAdminRole = await getUserRoleByKey(USER_ROLES.BASIC_ADMIN.user_role);
                    clientRole = await getUserRoleByKey(USER_ROLES.CLIENT.user_role);
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                // normal behavior
                expect(dbError).toBeNull();
                // assertions
                expect(fullAdminRole.id).toBe(getUserRoleId(USER_ROLES.FULL_ADMIN.user_role));
                expect(basicAdminRole.id).toBe(getUserRoleId(USER_ROLES.BASIC_ADMIN.user_role));
                expect(clientRole.id).toBe(getUserRoleId(USER_ROLES.CLIENT.user_role));
            }

        )
    }
)