import ChatSchema from '~/server/models/ChatSchema'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);

        if (!query.uid || !query.ruid) {
            return {
                code: 400,
                message: "Cannot fiund uid or ruid field"
            }
        }

        const chats = ChatSchema.find().where('users').all([query.uid, query.ruid]);

        return chats;
    } catch(e) {

        return {
            message: "Ошибка при получении пользователей"
        }
    }
})