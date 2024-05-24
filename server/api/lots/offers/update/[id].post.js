import { OfferSchema, LotsSchema } from "~/server/models/LotsSchema";

// this.offerid = this.offer.offerid
// this.chipid = this.offer.chipid
// this.owner = this.offer.owner
// this.platform = this.offer.server
// this.launcher = this.offer.launcher
// this.price = this.offer.price
// this.amount = this.offer.amount
// this.automatic = this.offer.automatic
// this.autoactive = this.offer.showinlist

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