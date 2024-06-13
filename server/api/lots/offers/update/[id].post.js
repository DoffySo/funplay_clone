import { OfferSchema, LotsSchema } from "~/server/models/LotsSchema";


export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const offer = await OfferSchema.findOne({
            offerid: body.offerid
        })
        if (offer) {
            offer.server = body.platform || null;
            offer.launcher = body.launcher || null;
            offer.price = body.price;
            offer.amount = body.amount;
            offer.automatic = body.automatic;
            offer.showinlist = body.autoactive;
            offer.shortDescription = body.shortDescription
            offer.longDescription = body.longDescription

            await offer.save()

            return {
                code: 200
            }
        }
        return offer;
    } catch(e) {

        return {
            message: "Ошибка при получении лотов"
        }
    }
})