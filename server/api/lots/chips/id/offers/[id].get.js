import { LotsSchema, OfferSchema } from "~/server/models/LotsSchema";

export default defineEventHandler(async (event) => {
    try {
        const chips = await LotsSchema.find({
            "chips.chipsid": event.context.params.id // Исправленный синтаксис
        }).exec();
        
        const chipid = chips[0].chips.filter(x => x.chipsid == event.context.params.id)[0].chipsid;

        const offers = await OfferSchema.find({
            chipid: chipid
        })
        return offers[0];
    } catch (e) {
        return {
            message: "Ошибка при получении суб-категорий: " + e.message
        };
    }
});
