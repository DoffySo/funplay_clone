import UserSchema from "~/server/models/UserSchema"

export default defineEventHandler(async () => {
    try {
        const users = await UserSchema.find({})
        return users.map(users => ({
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
            message: "Ошибка при получении пользователей"
        }
    }
})