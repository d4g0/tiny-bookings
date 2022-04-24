import { DB_UNIQUE_CONSTRAINT_ERROR_KEY, NOT_FOUND_RECORD_ERROR_KEY } from 'dao/Errors'
import { USER_ROLES, USER_ROLES_LIST } from '~/dao/DBConstans'
import { getAdminByEmail, deleteAdminByEmail, createAdmin, getAdminById } from 'dao/users/AdminDao.js'
import { createUserRole, getUserRoleByKey } from 'dao/users/UserRoleDao'
import { isValidAdminDescription, isValidEmail, isValidId, isValidUserName } from 'dao/utils'
import { v4 as uuid } from 'uuid'
import { isValidString } from 'utils'
const { log } = console;
describe(
    'Admin Dao',

    function () {

        // init test secuence, init required values if not present in db

        // ---------------
        // Globals 
        // ---------------

        var FULL_ADMIN_USER_ROLE_ID = null;
        var BASIC_ADMIN_USER_ROLE_ID = null;

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

        beforeAll(async () => {
            try {
                FULL_ADMIN_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.FULL_ADMIN.key)).id;
                BASIC_ADMIN_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.BASIC_ADMIN.key)).id;
            } catch (error) {
                log(error);
                throw error;
            }
        })


        // create and admin with postgres.js
        test(
            "Create an admin with postgres",
            async function () {
                var dbError = null, c_admin = null, b_admin = null;

                try {
                    // full admin
                    c_admin = await createAdmin({
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })

                    b_admin = await createAdmin({
                        user_role_id: BASIC_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })

                    // basic admin 
                    console.log({ c_admin, b_admin })
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBeNull()
                // full admin
                // id
                expect(isValidId(c_admin.id)).toBe(true);
                // user_role
                expect(USER_ROLES.FULL_ADMIN.key == c_admin.user_role).toBe(true);
                // admin_name
                expect(isValidUserName(c_admin.admin_name)).toBe(true);
                // admin_description
                expect(isValidAdminDescription(c_admin.admin_description)).toBe(true);
                // email
                expect(isValidEmail(c_admin.email)).toBe(true);
                // hash_password
                expect(typeof c_admin.hash_password).toBe('string');
                // reset_token
                expect(c_admin.reset_token).toBe(null);
                // created_at
                expect(typeof c_admin.created_at).toBe('string');
                // basic admin

                // b
                expect(isValidId(b_admin.id)).toBe(true);
                // user_role
                expect(USER_ROLES.BASIC_ADMIN.key == b_admin.user_role).toBe(true);
                // admin_name
                expect(isValidUserName(b_admin.admin_name)).toBe(true);
                // admin_description
                expect(isValidAdminDescription(b_admin.admin_description)).toBe(true);
                // email
                expect(isValidEmail(b_admin.email)).toBe(true);
                // hash_password
                expect(typeof b_admin.hash_password).toBe('string');
                // reset_token
                expect(b_admin.reset_token).toBe(null);
                // created_at
                expect(typeof b_admin.created_at).toBe('string');

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

                var dbError = null, cAdmin = null, rAdmin = null, idMatch = true;
                var delCount = null, delCompleted = null;

                try {


                    // create
                    cAdmin = await createAdmin({
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })

                    // read
                    rAdmin = await getAdminByEmail(cAdmin.email);

                    // delete
                    var { completed, count } = await deleteAdminByEmail(cAdmin.email);
                    delCompleted = completed;
                    delCount = count;
                    console.log({
                        cAdmin,
                        rAdmin,
                        delCompleted,
                        delCount
                    })

                    // if (createdAdmin.id == retrivedAdmin.id) {
                    //     idMatch = true;
                    // }


                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(idMatch).toBe(true);
                expect(dbError).toBeNull();
                expect(cAdmin).toMatchObject(rAdmin);
                expect(delCompleted).toBe(true);
                expect(delCount).toBe(1);
            }
        )

        // // [admins] Create 2 admins with same name error check
        test(
            "Check create 2 admins with same name error",
            async function () {

                var dbError = null, cAdmin = null;
                const ADMIN_NAME = uuid().substring(0, 6);

                try {
                    // create first admin
                    cAdmin = await createAdmin({
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: ADMIN_NAME,
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })

                    // atemp to create another with same name, 
                    // expect to rise a dbError
                    await createAdmin({
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: ADMIN_NAME,
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })



                } catch (error) {
                    // console.log(error);
                    console.log(`code: ` + error?.code)
                    dbError = error;
                    // clean db
                    await deleteAdminByEmail(adminData.email);
                }
                expect(dbError).toBeTruthy();
                expect(dbError.code).toBe(DB_UNIQUE_CONSTRAINT_ERROR_KEY);
            }

        )



        // [admins] Retrieve an admin by id
        test(
            "Retrive an admin by ID",
            async function () {
                var dbError = null, cAdmin = null, rAdmin = null;

                try {
                    cAdmin = await createAdmin({
                        user_role_id: FULL_ADMIN_USER_ROLE_ID,
                        admin_name: uuid().substring(0, 6),
                        admin_description: uuid().substring(0, 10),
                        email: uuid().substring(0, 4) + '@gmail.com',
                        hash_password: uuid().substring(0, 10)
                    })

                    rAdmin = await getAdminById(cAdmin.id);

                    await deleteAdminByEmail(cAdmin.email);
                    console.log({
                        cAdmin, rAdmin
                    });

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(cAdmin).toMatchObject(rAdmin);
            }
        )





    }
)