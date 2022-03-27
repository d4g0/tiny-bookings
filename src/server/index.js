const API_PORT = process.env.API_PORT || 3010;
import Express from 'express';
const app = Express();
import router from '~/server/router';
import { apiRateLimiter } from '~/server/middleware/index.js';
import helmet from 'helmet';



// app settings 
app.set('trust proxy', 1); // behind proxy setting
// general middlewares
app.use(apiRateLimiter, helmet());
app.use(Express.json());
// api routes
app.use('/api/', router);


// app logs
// TODO define










export function spinUpServer() {
    app.listen(API_PORT, () => { console.log('app listening at port:' + API_PORT) })
}