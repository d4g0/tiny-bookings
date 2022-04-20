import { prisma } from "db/PrismaClient";
import { isValidId } from "dao/utils";
import { isValidString } from "utils";


export async function createARoomPicture(room_id, filename) {

    if (!isValidId(room_id)) {
        throw new Error('Non Valid Id');
    }

    if (!isValidString(filename)) {
        throw new Error('Non Filename');
    }



    try {
        // create the room picture
        var roomPicture = await prisma.room_pictures.create({
            data: {
                room_id,
                filename
            }
        })

        return roomPicture;

    } catch (error) {
        throw error
    }
}

export async function deleteARoomPicture(room_picture_id) {

    if (!isValidId(room_picture_id)) {
        throw new Error('Non Valid Id');
    }





    try {
        // create the room picture
        var roomPicture = await prisma.room_pictures.delete({
            where: {
                id: room_picture_id
            }
        })

        return roomPicture;

    } catch (error) {
        throw error
    }
}