import mongoose, { Schema } from "mongoose";
// import bcrypt from 'bcrypt';
import AutoIncrementFactory from 'mongoose-sequence';

const connection = mongoose.connection;
const autoIncrement = AutoIncrementFactory(connection)

const chipsSchema = new Schema({
    chipsid: {type: Number, unique: true},
    server: {type: String},
    region: {type: String},
    name: {type: String, required: true},
    description: {type: String, required: true},
    platforms: [String]
})
chipsSchema.plugin(autoIncrement, {inc_field: 'chipsid'})

const Lot = new Schema({
    lotname: {type: String},
    chips: [chipsSchema],
    region: {type: Boolean, default: false},
    image: {type: String}
})

export const LotsSchema = mongoose.model("Lots", Lot);

// async function newlot() {
    
//     const testlot = new LotsSchema({
        // lotname: "AFK Arena",
        // chips: [
        //     {
        //         chipsid: 0,
        //         name: "Accounts"
        //     },
        //     {
        //         chipsid: 1,
        //         name: "Diamonds"
        //     },
        //     {
        //         chipsid: 2,
        //         name: "Top Up"
        //     },
        //     {
        //         chipsid: 3,
        //         name: "Services"
        //     },
        //     {
        //         chipsid: 4,
        //         name: "Other"
        //     },
        // ],
        // image: "afkarena.png"
//     });
//     await testlot.save()
// }

// newlot()

const offeritemsSchema = new Schema({
    sended: {type: Boolean, default: false},
    message: {type: String},
})

const Offer = new Schema({
    offerid: {type: Number, unique: true},
    chipid: {type: Number}, // по номеру chips (для возврата)
    owner: {type: Number}, // по uid
    bought: {type: Boolean, default: false},
    buyerid: {type: Number},
    confirmed: {type: Boolean, default: false},
    showinlist: {type: Boolean, default: true},
    automatic: {type: Boolean, default: false},
    deliveryitems: [offeritemsSchema],
    shortDescription: {type: String},
    longDescription: {type: String},
    server: {type: String},
    launcher: {type: String},
    price: {type: Number},
    amount: {type: Number},
})
Offer.plugin(autoIncrement, {inc_field: 'offerid'})

export const OfferSchema = mongoose.model("Offers", Offer);