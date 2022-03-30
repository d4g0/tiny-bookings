import { USER_ROLES } from "dao/DBConstans";
import { createAdminService } from "services/users/admin";
import { createAdmin, deleteAdminByEmail } from '~/dao/UserDao'

describe(
    'Admin Service Tests',
    function adminTests() {


        // test data for creation full admin
        var toCreateAdminData = {
            user_role: USER_ROLES.FULL_ADMIN.user_role,
            email: 'test-toCreateAdmin@gmail.com',
            admin_name: 'test-toCreateAdminData',
            admin_description: 'foo admin',
            password: 'supper foo password',
        }

        // test data for creation basic admin
        var basicAdminData = {
            user_role: USER_ROLES.BASIC_ADMIN.user_role,
            email: 'test-toCreateAdminBasic@gmail.com',
            admin_name: 'test-toCreateAdminData-Basic',
            admin_description: 'basic admin',
            password: 'supper foo password',
        }

        var adminData = {
            email: 'test-adminData@email.com',
            admin_name: 'test-adminData',
            admin_description: 'test admin for development',
            hash_password: 'supper foo hash password ',
            reset_token: 'supper reset token for test admin',
        }

        // create an admin (happy path)
        test(
            "Create a full admin and a basic",
            async function () {
                var dbError = null, fooAdmin = null, admin1 = null, basicFooAdmin = null;

                try {

                    // create a full admin to use it's id 
                    // in the createAdminService
                    admin1 = await createAdmin({
                        user_role: USER_ROLES.FULL_ADMIN.user_role,
                        email: adminData.email,
                        admin_name: adminData.admin_name,
                        admin_description: adminData.admin_description,
                        hash_password: adminData.hash_password,
                        reset_token: adminData.reset_token
                    });



                    fooAdmin = await createAdminService({
                        creator_admin_id: admin1.id,
                        user_role: toCreateAdminData.user_role,
                        email: toCreateAdminData.email,
                        admin_name: toCreateAdminData.admin_name,
                        admin_description: toCreateAdminData.admin_description,
                        password: toCreateAdminData.password
                    })


                    basicFooAdmin = await createAdminService({
                        creator_admin_id:admin1.id,
                        user_role:basicAdminData.user_role,
                        email:basicAdminData.email,
                        admin_name:basicAdminData.admin_name,
                        admin_description:basicAdminData.admin_description,
                        password:basicAdminData.password,
                        reset_token:'supper foo reset token'
                    })

                    console.log({
                        admin1,
                        fooAdmin,
                        basicFooAdmin
                    });

                    // clean db
                    await deleteAdminByEmail(admin1.email);
                    await deleteAdminByEmail(fooAdmin.email);
                    await deleteAdminByEmail(basicFooAdmin.email);

                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(fooAdmin.id).toBeGreaterThanOrEqual(0);
                expect(fooAdmin.user_role).toBeDefined();
                expect(fooAdmin.email).toBeDefined();
                expect(fooAdmin.admin_name).toBeDefined();
                expect(fooAdmin.admin_description).toBeDefined();
                expect(fooAdmin.hash_password).toBeDefined();
                expect(fooAdmin.created_at).toBeDefined();
            }
        )
    }
)