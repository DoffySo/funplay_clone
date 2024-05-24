import { OfferSchema, LotsSchema } from "~/server/models/LotsSchema";
import UserSchema from "~/server/models/UserSchema"

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
        console.log(body);


        const offer = await OfferSchema.findOne({offerid: body.offerid})
        const user = await UserSchema.findOne({uid: body.buyerid});
        
        if (offer && user) {

            if (user.balance < offer.price) {
                return {
                    code: 202,
                    message: "Not enough money"
                }
            }

            user.balance = user.balance - offer.price;
            offer.buyerid = user.uid;
            offer.bought = true;
            offer.showinlist = false;

            await offer.save();
            await user.save();

            return {
                code: 200
            }
        } else {
            return "err"
        }
    } catch(e) {

        return {
            message: "Ошибка: "+e
        }
    }
})