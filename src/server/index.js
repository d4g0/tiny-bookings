const API_PORT = process.env.API_PORT || 3010;
import Express from 'express';
const app = Express();
import router from '~/server/router';
import { apiRateLimiter, quickLogger } from '~/server/middleware/index.js';
import helmet from 'helmet';
import graphqlServer from '~/server/graphql'
import expressPlayground from 'graphql-playground-middleware-express';
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
// TODO Remove for production
app.use(quickLogger)

// api routes
app.use('/api/', router);

// cors
var allowedOrigins = mapLineToArray(process.env.API_ALLOWED_DOMAINS, ',');
// preflight /graphql
// app.options('/graphql', cors({ origin: allowedOrigins }));
// general
app.use(cors({ origin: allowedOrigins }));

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

    // set up graphql playground
    if (process.env.NODE_ENV != 'production') {
        app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
    }
    server = app.listen(API_PORT, () => { console.log('app listening at port:' + API_PORT) })
}

export async function closeServer() {
    return server.close();
}