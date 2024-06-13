import { OfferSchema, LotsSchema } from "~/server/models/LotsSchema";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const offer = new OfferSchema({
            // offerid: null,
            chipid: body.chipid,
            owner: body.owner,
            server: body.platform || null,
            launcher: body.launcher || null,
            price: body.price,
            amount: body.amount,
            automatic: body.automatic,
            showinlist:body.autoactive,
            shortDescription: body.shortDescription,
            longDescription: body.longDescription,
        })
        await offer.save()

        return {
            code: 200
        }
    } catch(e) {

        return {
            message: "Ошибка: "+e
        }
    }
})