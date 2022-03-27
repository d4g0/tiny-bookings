import { prisma } from '~/dao/PrismaClient'
import { getAdminByName } from '~/dao/UserDao.js'


describe(
    'User Dao',

    function userDaoTest() {
        
        var fullAdminData = {

        }

        prisma.admins.create({
            data:{
                user_role,
                admin_name,
                hash_password,
                admin_description,
                
            }
        })

        test(
            "create and retrieve a full-admin",
            async function() {

                // should create a full admin
                // should query the created admin
                // should compare the created with the returned
                // should remove the created admin to clean the db
                // should have not db connection errors in the execuitions
        
            }
        )

        

        test(
            'Retrieves a correct admin user by his name',
            async function () {

                
                var dbError = null, adminUser = null;
                try {
                    adminUser = await getAdminByName('dago');
                } catch (error) {
                    dbError = error
                }
                expect(dbError).toBeNull();
                expect(adminUser).toBeDefined();
                expect(adminUser.admin_name).toBe('dago');
                expect(adminUser.user_role).toBe('full-admin')
                // var admin = { name: 'dago' };
                // expect(admin.name).toBe('dago');

            }
        )



    }
)