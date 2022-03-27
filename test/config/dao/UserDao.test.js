import { prisma } from '~/dao/PrismaClient'
import { createFullAdmin, getAdminByName, deleteAdminByName } from '~/dao/UserDao.js'
import { USER_ROLES } from "~/dao/DBConstans";


describe(
    'User Dao',

    function userDaoTest() {

        // user_role: USER_ROLES.FULL_ADMIN.id,
        var adminData = {
            admin_name: 'test-admin',
            admin_description: 'test admin for development',
            hash_password: 'supper foo hash password ',
            reset_token: 'supper reset token for test admin',
        }



        test(
            "Create, Retrieve and Delete a full-admin",
            async function () {

                // should create a full admin
                // should query the created admin
                // should compare the created with the returned
                // should remove the created admin to clean the db
                // should have not db connection errors in the execuitions

                var dbError = null, createdAdmin = null, retrivedAdmin = null, deletedAdmin = null, idMatch = true;
                try {


                    // create
                    createdAdmin = await createFullAdmin({
                        admin_name: adminData.admin_name,
                        admin_description: adminData.admin_description,
                        hash_password: adminData.hash_password,
                        reset_token: adminData.reset_token
                    })

                    // read
                    retrivedAdmin = await getAdminByName(adminData.admin_name);

                    // delete
                    deletedAdmin = await deleteAdminByName(adminData.admin_name);

                    console.log(deletedAdmin);

                    if (createdAdmin.id == retrivedAdmin.id && retrivedAdmin.id == deletedAdmin.id) {
                        idMatch = true;
                    }

                    // console.log(createdAdmin)

                } catch (error) {
                    console.log(error)
                    dbError = error;
                }
                expect(createdAdmin.admin_name).toBe(adminData.admin_name);
                expect(retrivedAdmin.admin_name).toBe(adminData.admin_name);
                expect(deletedAdmin.admin_name).toBe(adminData.admin_name);
                expect(idMatch).toBe(true);
                expect(dbError).toBeNull();

            }
        )



    }
)