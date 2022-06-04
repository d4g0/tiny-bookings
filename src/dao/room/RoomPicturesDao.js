import { prisma } from "db/PrismaClient";
import { isValidId } from "dao/utils";
import { isValidString } from "utils";
import { ValidationError } from "errors";
import sql from "db/postgres";


export async function createARoomPicture(room_id, filename) {

    if (!isValidId(room_id)) {
        throw new Error('Non Valid Id');
    }

    if (!isValidString(filename)) {
        throw new Error('Non Filename');
    }



    try {

        const cRes = await sql`
            insert into room_pictures (room_id, filename) values (${room_id}, ${filename}) returning *;
        `;

        

        const room_picture = cRes[0] || null;

        // console.log(`pic dao create cRes: `, cRes);
        // console.log(`cRes[0]: `, cRes[0]);
        // console.log(`room_picture: `, room_picture);

        return room_picture;

    } catch (error) {
        throw error
    }
}

export async function deleteARoomPicture(room_picture_id) {

    if (!isValidId(room_picture_id)) {
        throw new Error('Non Valid Id');
    }


    try {

        const dRes = await sql`
            delete from room_pictures where id = ${room_picture_id} returning *;
        `;

        var roomPicture = dRes[0] || null;
        
        // console.log({roomPicture})

        return roomPicture;

    } catch (error) {
        throw error
    }
}

export async function updateRoomPictureFileName(room_picture_id, new_file_name) {


    if (!isValidId(room_picture_id)) {
        throw new ValidationError('Non valid room_picture_id', 'room_picture_id');
    }

    if (!isValidString(new_file_name)) {
        throw new ValidationError('Non valid new_file_name', 'new_file_name');
    }

    try {
        const upRes = await sql`
            update room_pictures rp 
                set filename = ${new_file_name} 
                where rp.id = ${room_picture_id} returning *;
        `;

        
        // console.log(`pic dao  update uRes: `, upRes);


        const room_picture = upRes[0] || null;
        return room_picture;
    } catch (error) {
        throw error;
    }
}