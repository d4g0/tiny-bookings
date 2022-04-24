
import { USER_ROLES } from 'dao/DBConstans';
import { createNonUserClient, createUserClient, deleteClient } from 'dao/users/ClientDao';
import { getUserRoleByKey } from 'dao/users/UserRoleDao';
import { isValidId, isValidUserName } from 'dao/utils';
import { v4 as uuid } from 'uuid'


var CLIENT_USER_ROLE_ID = null;
beforeAll(async () => {
    CLIENT_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.CLIENT.key)).id;
})





describe(
    'Client Dao',

    function () {
        // create a room lock
        test(
            "Create and delete a non user client ",
            async function () {

                var dbError = null, client = null, delClient = null;

                try {
                    client = await createNonUserClient({
                        user_role: CLIENT_USER_ROLE_ID,
                        client_name: uuid().substring(0, 10),
                        client_last_name: uuid().substring(0, 10)
                    });
                    // clean
                    delClient = await deleteClient(client.id)
                    console.log({ client, delClient })
                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBe(null);
                expect(client.id).toBeDefined();
                expect(delClient.id).toBe(client.id);
                expect(client.user_role).toBeDefined()
                expect(client.client_name).toBeDefined()
                expect(client.client_last_name).toBeDefined()
                expect(client.hash_password).toBeNull();
                expect(client.email).toBeNull();
                expect(client.is_email_verified).toBe(false);
                expect(client.reset_token).toBeNull();
                expect(client.created_at).toBeDefined();



            }
        )

        // Create a user client
        test(
            "Create a user client",
            async function () {
                var dbE = null, client = null;
                const HASH_PASSW = 'foo-bar-baz';
                const EMAIL = uuid().substring(0, 4) + '@gmail.com';
                try {
                    client = await createUserClient({
                        user_role_id: CLIENT_USER_ROLE_ID,
                        client_name: uuid().substring(0, 10),
                        client_last_name: uuid().substring(0, 10),
                        hash_password: HASH_PASSW,
                        email: EMAIL
                    })

                    console.log({ client });
                } catch (error) {
                    dbE = error;
                    console.log(error);
                }

                expect(dbE).toBeNull();
                expect(isValidId(client.id)).toBe(true);
                expect(client.user_role).toBe(USER_ROLES.CLIENT.key);
                expect(isValidUserName(client.client_name)).toBe(true);
                expect(isValidUserName(client.client_last_name)).toBe(true);
                expect(client.hash_password).toBe(HASH_PASSW);
                expect(client.email).toBe(EMAIL);
                expect(client.reset_token).toBe(null);
                expect(client.created_at).toBeDefined()
                
            }
        )
    })