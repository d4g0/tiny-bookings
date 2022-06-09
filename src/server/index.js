const API_PORT = process.env.API_PORT || 3010;
import Express from 'express';
const app = Express();
import router from '~/server/router';
import { apiRateLimiter, quickLogger } from '~/server/middleware/index.js';
import helmet from 'helmet';
import graphqlServer from '~/server/graphql';
import cors from 'cors';
import { mapLineToArray } from 'utils';

// app settings
// behind proxy setting
app.set('trust proxy', 1);
// general middlewares
if (process.env.NODE_ENV == 'production') {
    app.use(apiRateLimiter, helmet());
}
app.use(Express.json());
// quick logger
if (process.env.NODE_ENV != 'production') {
    app.use(quickLogger);
}

// cors
var allowedOrigins = mapLineToArray(process.env.API_ALLOWED_DOMAINS, ',');

// api routes
app.use('/api/', cors({ origin: allowedOrigins }), router);

// preflight /graphql
app.options('/graphql', cors({ origin: allowedOrigins }));
// general
// app.use(cors({ origin: allowedOrigins }));

// graphql
async function setupGraphQl() {
    await graphqlServer.start();
    graphqlServer.applyMiddleware({ app });
}

// app logs
// TODO define
var server;
export function spinUpServer() {
    setupGraphQl();

    server = app.listen(API_PORT, () => {
        console.log('app listening at port:' + API_PORT);
    });
}

export async function closeServer() {
    return server.close();
}
