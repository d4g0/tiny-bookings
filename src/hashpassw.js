const bcrypt = require('bcryptjs');
var args = process.argv.slice(2);


async function printHash() {
    const password = args[0] || 'foo';
    const hash = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(password, hash);
    console.log(hashed_password)
}

printHash()