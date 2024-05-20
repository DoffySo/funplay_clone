import { LotsSchema } from "~/server/models/LotsSchema";

export default defineEventHandler(async (event) => {
    try {
        const chips = await LotsSchema.find({
            "chips.chipsid": event.context.params.id // Исправленный синтаксис
        }).exec();
        
        return chips[0];
    } catch (e) {
        return {
            message: "Ошибка при получении суб-категорий: " + e.message
        };
    }
});
