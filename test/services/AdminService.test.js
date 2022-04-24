import { USER_ROLES } from "dao/DBConstans";
import { createAdminService, getAdminByEmailPassword, getAdminByEmailService, getAdminsService } from "services/users/admin";
import { createAdmin, deleteAdminByEmail, deleteAdminById } from 'dao/users/AdminDao'
import { getUserRoleByKey } from "dao/users/UserRoleDao";
const { log } = console;
import { v4 as uuid } from 'uuid'

// ---------------
// Globals 
// ---------------

var FULL_ADMIN_USER_ROLE_ID = null;
var BASIC_ADMIN_USER_ROLE_ID = null;


beforeAll(async () => {
    try {
        FULL_ADMIN_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.FULL_ADMIN.key)).id;
        BASIC_ADMIN_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.BASIC_ADMIN.key)).id;
    } catch (error) {
        log(error);
        throw error;
    }
})


describe(
    'Admin Service Tests',
    function adminTests() {




        // create an admin (happy path)
        test(
            "Create a full admin",
            async function () {
                var dbError = null, fooAdmin = null, c_admin = null, b_admin = null;

                try {

                    // create a full admin to use it's id 
                    // in the createAdminService
                    // full admin
                    c_admin = await createAdmin({
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })


                    b_admin = await createAdminService({
                        creator_admin_id: c_admin.id,
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        password: uuid().substring(0, 10)
                    })

                    console.log({
                        b_admin,
                    });

                    // clean db
                    await deleteAdminByEmail(c_admin.email);
                    await deleteAdminByEmail(b_admin.email);

                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(b_admin.id).toBeGreaterThanOrEqual(0);
                expect(b_admin.user_role).toBeDefined();
                expect(b_admin.email).toBeDefined();
                expect(b_admin.admin_name).toBeDefined();
                expect(b_admin.admin_description).toBeDefined();
                expect(b_admin.hash_password).toBeDefined();
                expect(b_admin.created_at).toBeDefined();
            }
        )

        // get an admin user by email and password happy path
        test(
            "Gets an admin user by it's email and password",
            async function () {

                var dbError = null, aAdmin = null, bAdmin = null, fAdmin = null;
                const PASSWORD = 'foo-bar-baz';

                try {

                    aAdmin = await createAdmin({
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })

                    bAdmin = await createAdminService({
                        creator_admin_id: aAdmin.id,
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        password: PASSWORD
                    })

                    fAdmin = await getAdminByEmailPassword(bAdmin.email, PASSWORD);

                    log({
                        fAdmin
                    })
                    // clean
                    await deleteAdminById(aAdmin.id);
                    await deleteAdminById(bAdmin.id);
                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(fAdmin.id).toBeDefined();
                expect(fAdmin).toStrictEqual(bAdmin);
            }
        )

    }
)