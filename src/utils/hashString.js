var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);
// Store hash in your password DB.

(
    async function generateHashedPassword() {
        var start_time = Date.now()
        var password = 'supper-foo-pass';
        const hash = await bcrypt.genSalt(10);
        const hashPasw = await bcrypt.hash(password, hash);


        var comparationResult = await bcrypt.compare(password,hashPasw);
        var execution_time = Date.now() - start_time;

        console.log({
            hashPasw,
            comparationResult,
            execution_time,
        })
    }
)()