import ChatSchema from '~/server/models/ChatSchema'

export default defineEventHandler(async (event) => {
    try {
        const query = await readBody(event);

        const chat = await ChatSchema.findOne({
            chatid: query.chatid
        })

        if (chat) {
            chat.messages.push({
                senderuid: query.senderuid,
                message: query.message,
                date: Date.now()
            });

            await chat.save()

            
            return chat;
        } else {
            return {
                code: 400,
                message: "Cannot find chat with the given ID!"
            };
        }

        return query;
    } catch(e) {

        return {
            message: "Ошибка:"+e
        }
    }
})