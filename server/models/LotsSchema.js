import mongoose, { Schema } from "mongoose";
// import bcrypt from 'bcrypt';
import AutoIncrementFactory from 'mongoose-sequence';

const connection = mongoose.connection;
const autoIncrement = AutoIncrementFactory(connection)

const chipsSchema = new Schema({
    chipsid: {type: Number, unique: true},
    server: {type: String},
    name: {type: String}
})
chipsSchema.plugin(autoIncrement, {inc_field: 'chipsid'})

const Lot = new Schema({
    lotname: {type: String},
    chips: [chipsSchema],
    servers: {type: Boolean, default: false},
    image: {type: String}
})

export const LotsSchema = mongoose.model("Lots", Lot);

const offeritemsSchema = new Schema({
    sended: {type: Boolean, default: false},
    message: {type: String},
})

const Offer = new Schema({
    offerid: {type: Number, unique: true},
    chipid: {type: Number}, // по номеру chips (для возврата)
    owner: {type: Number}, // по uid
    bought: {type: Boolean, default: false},
    confirmed: {type: Boolean, default: false},
    showinlist: {type: Boolean, default: true},
    automatic: {type: Boolean, default: false},
    deliveryitems: [offeritemsSchema],
})
Offer.plugin(autoIncrement, {inc_field: 'offerid'})

export const OfferSchema = mongoose.model("Offers", Offer);