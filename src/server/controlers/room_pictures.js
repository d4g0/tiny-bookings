// update a rooms is picture

// check if the room currently have a picture
//      mark current filename for latter in a req special key 
// handle the upload, 
//      generate a unique filename
//      move the picture to static folder serving asstets (PICTURES_STORE)
//      update the rooms is new picture filename
//  if pending delete filename 
//      delete the current picture file in store (PICTURES_STORE)


import { getRoomById } from 'services/room';
import { createARoomPicture, updateRoomPictureFileName } from 'dao/room/RoomPicturesDao';
import xss from 'xss';
const PICTURES_FILE_STORAGE = process.env.PICTURES_FILE_STORAGE || '';
import { v4 as uuid } from 'uuid';
import { unlink } from 'fs/promises';
import path from 'path';




/** @type {import("express").RequestHandler} */
export async function roomPictureUploadHandler(req, res, next) {


    // parse room id
    const { room_id } = req.query;
    const s_room_id = Number(xss(room_id));

    // console.log('working with room:', s_room_id);

    var oldPictureFileName = null;

    try {

        const room = await getRoomById(s_room_id);
        const room_pictures = room.room_pictures;
        const firstRoomPicture = room_pictures[0];

        // console.log('firsPic:', firstRoomPicture || 'Room has no pictures');

        var shouldPerformAnUpdate = false;

        if (firstRoomPicture) {
            oldPictureFileName = firstRoomPicture.filename;
            shouldPerformAnUpdate = true;
        }


        // if no files
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // files found
        let nrp = req.files.new_room_picture;
        // generate a name for the picture file
        const s_name = xss(nrp.name);
        const newPicName = generateUniqueName(s_name);
        // move to location
        const destination = path.join(PICTURES_FILE_STORAGE, newPicName);
        console.log({ destination });
        await nrp.mv(destination)
        var updated_room_picture;

        // update  or create room is room_picture filename
        if (shouldPerformAnUpdate) {

            updated_room_picture = await updateRoomPictureFileName(firstRoomPicture.room_picture_id, newPicName);

            // console.log('update Perfomed roomPic: ', updated_room_picture);
        } else {

            updated_room_picture = await createARoomPicture(room.id, newPicName);

            // console.log('create Perfomed roomPic: ', updated_room_picture);
        }



        // clean old pic file
        if (oldPictureFileName) {
            await deletePictureFromFileStorage(oldPictureFileName);
        }



        res.status(200).json({ result: 'OK', data: { room_picture: updated_room_picture } });

    } catch (error) {
        console.log(error)
        res.status(200).json({ result: 'FAIL', error })
    }

}



async function deletePictureFromFileStorage(filename) {
    try {
        const destination = path.join(PICTURES_FILE_STORAGE, filename);
        // console.log('deleting: ' + filename);
        await unlink(destination);

    } catch (error) {
        console.error(error);
    }
}


// https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/1203361#1203361
function generateUniqueName(filename = '') {
    const ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    const uniqueName = uuid();
    return `${uniqueName}.${ext}`;
}