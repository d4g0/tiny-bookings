const postgres = require('postgres');

const sql = postgres({
    max: parseInt(process.env.PG_MAX_CONNECTIONS) || 2,
    types: {
        date: {
            to: 1184,
            from: [1082, 1114, 1184],
            serialize: x => {
                if (typeof x != 'string') {
                    throw new Error('Non string date detected')
                }
                return x
            },
            parse: x => x
        }
    }
});


module.exports = sql
// export default sql avoided here for sql.end Type Error function when teardown the testing
