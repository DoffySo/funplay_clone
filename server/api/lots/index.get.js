import { LotsSchema } from "~/server/models/LotsSchema"

export default defineEventHandler(async () => {
    try {
        const lots = await LotsSchema.find({})
        return lots.map(lot => ({
            lotname: lot.lotname,
            chips: lot.chips,
            servers: lot.servers,
            image: lot.image
        }))
    } catch(e) {

        return {
            message: "Ошибка при получении лотов"
        }
    }
})