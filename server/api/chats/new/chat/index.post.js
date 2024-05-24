import ChatSchema from '~/server/models/ChatSchema'

export default defineEventHandler(async (event) => {
    try {
        const query = await readBody(event);

        if (chat) {
            const newChat = new ChatSchema({
                users: [
                    query.uid,
                    query.ruid,
                ],
                messages: [],
            })

            await newChat.save()

            
            return {
                code: 200
            };
        } else {
            return {
                code: 400
            };
        }

        return query;
    } catch(e) {

        return {
            message: "Ошибка:"+e
        }
    }
})