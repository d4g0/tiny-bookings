
import { getUserRoleId, USER_ROLES } from 'dao/DBConstans';
import { createNonUserClient, deleteClient } from 'dao/users/ClientDao';
import { v4 as uuid } from 'uuid'

// need deps
// a hotel and a room






describe(
    'Client Dao',

    function roomTypesDaoTest() {
        // create a room lock
        test(
            "Create and delete a non user client ",
            async function () {

                var dbError = null, client = null, delClient = null;

                try {
                    client = await createNonUserClient({
                        user_role: getUserRoleId(USER_ROLES.CLIENT.user_role),
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
                expect(client.reset_token).toBeNull();
                expect(client.created_at).toBeDefined();



            }
        )



    })