
import { USER_ROLES } from 'dao/DBConstans';
import { createNonUserClient, createUserClient, deleteClient } from 'dao/users/ClientDao';
import { getUserRoleByKey } from 'dao/users/UserRoleDao';
import { isValidId, isValidUserName } from 'dao/utils';
import { singUp } from 'services/users/clients';
import { v4 as uuid } from 'uuid'


var CLIENT_USER_ROLE_ID = null;
beforeAll(async () => {
    CLIENT_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.CLIENT.key)).id;
})





describe(
    'Client Service',

    function () {
        // create a room lock
        test(
            "Sing up",
            async function () {

                var dbError = null, client = null;
                const PASSW = 'supper-foo-pass';
                const EMAIL = uuid().substring(0, 4) + '@gmail.com';
                const CLIENT_NAME = uuid().substring(0, 10);
                const CLIENT_LAST_NAME = uuid().substring(0, 10);
                try {
                    client = await singUp({
                        client_name: CLIENT_NAME,
                        client_last_name: CLIENT_LAST_NAME,
                        email: EMAIL,
                        password: PASSW
                    });
                    // clean
                    await deleteClient(client.id)
                    console.log({ client })
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(client.id).toBeDefined();
                expect(client.user_role).toBe(USER_ROLES.CLIENT.key)
                expect(client.client_name).toBe(CLIENT_NAME);
                expect(client.client_last_name).toBe(CLIENT_LAST_NAME);
                expect(client.hash_password).toBeDefined();
                expect(client.email).toBe(EMAIL);
                expect(client.is_email_verified).toBe(false);
                expect(client.reset_token).toBeNull();
                expect(client.created_at).toBeDefined();
            }
        )

        
    })