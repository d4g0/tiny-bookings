import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from 'dao/Errors'
import { USER_ROLES } from '~/dao/DBConstans'
import { getAdminByEmail, deleteAdminByEmail, createAdmin, getAdminById } from '~/dao/UserDao.js'


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

        var basicAdminData = {
            user_role: USER_ROLES.BASIC_ADMIN.user_role,
            email: 'test-basic@email.com',
            admin_name: 'test-basic-admin',
            admin_description: 'test admin for development',
            hash_password: 'supper foo hash password ',
            reset_token: 'supper reset token for test admin',
        }

        var fullAdminData = {
            user_role: USER_ROLES.FULL_ADMIN.user_role,
            email: 'test-full@email.com',
            admin_name: 'test-full-admin',
            admin_description: 'test admin for development',
            hash_password: 'supper foo hash password ',
            reset_token: 'supper reset token for test admin',
        }

        // [admins] Retrieve an admin by name that doesn't exists
        test(
            "Check error of retrieve an admin that doesen't exist",
            async function () {
                var dbError = null, shouldBeNullRes = 'null-placeholder';

                try {
                    shouldBeNullRes = await getAdminByEmail('this-admin-email@should.not.exist');
                } catch (error) {
                    console.log(error);
                    dbError = error
                }

                expect(dbError).toBe(null);
                expect(shouldBeNullRes).toBe(null)

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
                    createdAdmin = await createAdmin({
                        // next comming
                        user_role: USER_ROLES.FULL_ADMIN.user_role,
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
                expect(retrivedAdmin).toMatchObject(deletedAdmin)


            }
        )

        // // [admins] Create 2 admins with same name error check
        test(
            "Check create 2 admins with same name error",
            async function () {

                var dbError = null, admin1 = null, createAdminError = null;


                try {
                    // create first admin
                    admin1 = await createAdmin({
                        user_role: USER_ROLES.FULL_ADMIN.user_role,
                        email: adminData.email,
                        admin_name: adminData.admin_name,
                        admin_description: adminData.admin_description,
                        hash_password: adminData.hash_password,
                        reset_token: adminData.reset_token
                    });

                    // atemp to create another with same name, 
                    // expect to rise a dbError
                    await createAdmin({
                        user_role: USER_ROLES.FULL_ADMIN.user_role,
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
                expect(dbError.code).toBe(DB_UNIQUE_CONSTRAINT_ERROR_KEY);
            }

        )

        // [admins] Create a full and a basic admin
        test(
            "Create a Full and a Basic admin",
            async function () {
                var dbError = null,
                    basicAdmin = null,
                    basicAdminExtract = null,
                    fullAdmin = null,
                    fullAdminExtract = null;

                try {
                    basicAdmin = await createAdmin(basicAdminData);
                    basicAdminExtract = {
                        user_role: basicAdmin.user_role,
                        email: basicAdmin.email,
                        admin_name: basicAdmin.admin_name,
                        admin_description: basicAdmin.admin_description,
                        hash_password: basicAdmin.hash_password,
                        reset_token: basicAdmin.reset_token,
                    }
                    fullAdmin = await createAdmin(fullAdminData);
                    fullAdminExtract = {
                        user_role: fullAdmin.user_role,
                        email: fullAdmin.email,
                        admin_name: fullAdmin.admin_name,
                        admin_description: fullAdmin.admin_description,
                        hash_password: fullAdmin.hash_password,
                        reset_token: fullAdmin.reset_token,
                    }

                    // happy path clean
                    await deleteAdminByEmail(basicAdmin.email);
                    await deleteAdminByEmail(fullAdmin.email);


                } catch (error) {
                    console.log(error);
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(basicAdminData).toMatchObject(basicAdminExtract);
                expect(fullAdminData).toMatchObject(fullAdminExtract);
            }
        )

        // [admins] Retrieve an admin by id
        test(
            "Retrive an admin by ID",
            async function () {
                var dbError = null, admin1 = null, retrievedAdmin = null;

                try {
                    admin1 = await createAdmin({
                        user_role: USER_ROLES.FULL_ADMIN.user_role,
                        email: adminData.email,
                        admin_name: adminData.admin_name,
                        admin_description: adminData.admin_description,
                        hash_password: adminData.hash_password,
                        reset_token: adminData.reset_token
                    });

                    retrievedAdmin = await getAdminById(admin1.id);

                    await deleteAdminByEmail(admin1.email);


                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(admin1).toMatchObject(retrievedAdmin);
            }
        )





    }
)