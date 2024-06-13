import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
    try {
        const files = await readMultipartFormData(event)
        if (!files) {
            return createError({
                statusCode: 400,
                statusMessage: "No files selected: "+e
            });
        }
        let filename;

        for(const file of files) {
            filename = file.filename
            await useStorage().setItemRaw(`fs:${file.filename}`, file.data)
        }

        return {
            code: 200,
            filename: filename
        }

    } catch(e) {
        return createError({
            statusCode: 500,
            statusMessage: "An error occured when uploading file: "+e
        });
    }
})