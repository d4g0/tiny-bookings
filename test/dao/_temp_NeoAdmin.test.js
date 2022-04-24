const { getAdminJoinRole, getAdminByEmail_NO_THROW } = require("dao/users/AdminDao");
const { getClientByEmail } = require("dao/users/ClientDao");

describe(
    'New Admin Test (quick)',

    function () {
        test(
            "Check new adminJoin fetch",
            async function() {
                var dago = await getAdminByEmail_NO_THROW('dago@gmail.com');

                console.log(dago)


                var lila = await getClientByEmail('lila@gmail.com');

                console.log(lila)
                expect(dago).toBeDefined()
            }
        )
    }
)