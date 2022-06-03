import Express from 'express';
import { roomPictureUploadHandler } from 'server/controlers/room_pictures';
import fileUpload from 'express-fileupload';

/**
 * The api router
 */
const router = Express.Router()

router.route('/').get(foo);



router.use(fileUpload());


// pictures
router.route('/room_pictures/').post(roomPictureUploadHandler);




/** @type RequestHandler */
function foo(req, res, next) {
    res.end('up and running');
}


export default router;