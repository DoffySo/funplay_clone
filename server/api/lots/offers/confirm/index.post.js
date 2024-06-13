import { OfferSchema, LotsSchema } from "~/server/models/LotsSchema";
import UserSchema from "~/server/models/UserSchema"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        
        const offer = await OfferSchema.findOne({offerid: body.offerid})
        const user = await UserSchema.findOne({uid: body.buyerid});
        
        if (offer && user) {
            const receiver = await UserSchema.findOne({uid: offer.owner});
            if (!receiver) {
                return {
                    code: 400,
                }
            }

            receiver.balance = receiver.balance + offer.price;

            await receiver.save();

            offer.confirmed = true;
            offer.showinlist = false;
            offer.active = false;

            await offer.save();

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