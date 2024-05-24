import ChatSchema from '~/server/models/ChatSchema';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);

        if (!query.uid || !query.ruid) {
            console.error("Missing uid or ruid");
            return {
                code: 400,
                message: "Cannot find uid or ruid field"
            };
        }

        const uid = parseInt(query.uid, 10);
        const ruid = parseInt(query.ruid, 10);

        if (isNaN(uid) || isNaN(ruid)) {
            console.error("Invalid uid or ruid");
            return {
                code: 400,
                message: "Invalid uid or ruid"
            };
        }

        // Поиск чата между двумя пользователями
        const chat = await ChatSchema.findOne({
            $or: [
                { users: [query.uid, query.ruid] },
                { users: [query.ruid, query.uid] }
            ]
        });
        
        console.log(uid, ruid);

        if (!chat) {
            console.error("Chat not found");
            return {
                code: 404,
                message: "Chat not found"
            };
        }

        console.log("Chat found:", chat);

        return chat;
    } catch (e) {
        console.error("Error fetching chat data:", e.message);
        return {
            code: 500,
            message: "Error fetching chat data",
            error: e.message
        };
    }
});
