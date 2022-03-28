import { USER_DAO_ERRORS, createFullAdmin, getAdminByEmail, deleteAdminByEmail } from '~/dao/UserDao.js'


describe(
    'User Dao',

    function userDaoTest() {

        var adminData = {
            email: 'test@email.com',
            admin_name: 'test-admin',
            admin_description: 'test admin for development',
            hash_password: 'supper foo hash password ',
            reset_token: 'supper reset token for test admin',
        }

        // [admins] Retrieve an admin by name that doesn't exists
        test(
            "Check error of retrieve an admin that doesen't exist",
            async function () {
                var dbError = null;

                try {
                    await getAdminByEmail('this-admin-email@should.not.exist');
                } catch (error) {
                    console.log(error);
                    dbError = error
                }

                expect(dbError).toBeTruthy();
                expect(dbError.message).toBe(USER_DAO_ERRORS.NOT_FOUND)

            }
        )


        // [admins] Create, retrieve, and delete (happy path)
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
                        email: adminData.email,
                        admin_name: adminData.admin_name,
                        admin_description: adminData.admin_description,
                        hash_password: adminData.hash_password,
                        reset_token: adminData.reset_token
                    })

                    // read
                    retrivedAdmin = await getAdminByEmail(adminData.email);

                    // delete
                    deletedAdmin = await deleteAdminByEmail(adminData.email);

                    console.log(deletedAdmin);

                    if (createdAdmin.id == retrivedAdmin.id && retrivedAdmin.id == deletedAdmin.id) {
                        idMatch = true;
                    }

                    console.log(createdAdmin)

                } catch (error) {
                    console.log(error)
                    dbError = error;
                }
               
                expect(idMatch).toBe(true);
                expect(dbError).toBeNull();
                expect(createdAdmin).toMatchObject(retrivedAdmin);
                expect(retrivedAdmin).toMatchObject(deletedAdmin);

            }
        )

        // [admins] Create 2 admins with same name error check
        test(
            "Check create 2 admins with same name error",
            async function () {

                var dbError = null, admin1 = null, createAdminError = null;


                try {
                    // create first admin
                    admin1 = await createFullAdmin({
                        email: adminData.email,
                        admin_name: adminData.admin_name,
                        admin_description: adminData.admin_description,
                        hash_password: adminData.hash_password,
                        reset_token: adminData.reset_token
                    });

                    // atemp to create another with same name, 
                    // expect to rise a dbError
                    await createFullAdmin({
                        email: adminData.email,
                        admin_name: adminData.admin_name,
                        admin_description: adminData.admin_description,
                        hash_password: adminData.hash_password,
                        reset_token: adminData.reset_token
                    });



                } catch (error) {
                    console.log(error);
                    dbError = error;
                    // clean db
                    await deleteAdminByEmail(adminData.email);
                }

                expect(dbError).toBeTruthy();
                expect(dbError.code).toBe('P2002')
            }

        )







    }
)