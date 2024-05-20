import { OfferSchema } from "~/server/models/LotsSchema";

export default defineEventHandler(async (event) => {
    try {
        const offers = await OfferSchema.find({
            offerid: event.context.params.id
        })
        return offers;
    } catch (e) {
        return {
            message: "Ошибка при получении суб-категорий: " + e.message
        };
    }
});
