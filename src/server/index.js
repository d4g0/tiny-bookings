const API_PORT = process.env.API_PORT || 3010;
import Express from 'express';
const app = Express();
import router from '~/server/router';
import { apiRateLimiter } from '~/server/middleware/index.js';
import helmet from 'helmet';
import graphqlServer from '~/server/graphql'
import expressPlayground from 'graphql-playground-middleware-express';

// app settings 
// behind proxy setting
app.set('trust proxy', 1);
// general middlewares
if (process.env.NODE_ENV == 'production') {
    app.use(apiRateLimiter, helmet());
}
app.use(Express.json());
// api routes
app.use('/api/', router);

// graphql
async function setupGraphQl() {
    await graphqlServer.start();
    graphqlServer.applyMiddleware({ app });
}

// app logs
// TODO define

export function spinUpServer() {
    setupGraphQl();

    // set up graphql playground
    if (process.env.NODE_ENV != 'production') {
        app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
    }
    app.listen(API_PORT, () => { console.log('app listening at port:' + API_PORT) })
}