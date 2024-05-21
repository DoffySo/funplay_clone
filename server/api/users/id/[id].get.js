import UserSchema from "~/server/models/UserSchema"

export default defineEventHandler(async (event) => {
    try {
        const users = await UserSchema.find({
            uid: event.context.params.id
        }).exec()
        return users.map(users => ({
            _id: users._id,
            uid: users.uid,
            username: users.username,
            email: users.email,
            registerDate: users.registerDate,
            avatarName: users.avatarName,
            balance: users.balance,
            admin: users.admin,
            support: users.support,
            banned: users.banned,
        }))
    } catch(e) {

        return {
            message: "Ошибка при получении пользователей: "+e
        }
    }
})