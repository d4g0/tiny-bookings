import Express from 'express';
/**
 * The api router
 */
const router = Express.Router()

router.route('/').get(foo);









/** @type RequestHandler */
function foo(req, res, next) {
    res.end('up and running');
}


export default router;