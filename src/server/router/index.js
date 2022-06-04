import Express from 'express';
import { roomPictureUploadHandler } from 'server/controlers/room_pictures';
import fileUpload from 'express-fileupload';
import {
    authenticate,
    authenticated,
    authorized
} from '~/server/middleware/index'
import { USER_ROLES } from 'dao/DBConstans';
/**
 * The api router
 */
const router = Express.Router()

router.route('/').get(foo);



router.use(fileUpload());


// pictures
router.route('/room_pictures/').post(
    authenticate,
    authenticated,
    authorized([USER_ROLES.BASIC_ADMIN.key, USER_ROLES.FULL_ADMIN.key]),
    // (req, res, next) => {
    //     console.log({ user: req.user });
    //     next();
    // },
    roomPictureUploadHandler,

);




/** @type RequestHandler */
function foo(req, res, next) {
    res.end('up and running');
}


export default router;