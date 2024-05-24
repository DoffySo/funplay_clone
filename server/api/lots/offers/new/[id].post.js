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