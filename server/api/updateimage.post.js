import UserSchema from '../models/UserSchema'

export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)

        const user = await UserSchema.findOneAndUpdate({_id: data._id}, {avatarName: `/uploads/${data.filename}`})
        await user.save()

        

    } catch(e) {
        return createError({
            statusCode: 500,
            statusMessage: e
        });
    }
})