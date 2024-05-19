import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import AutoIncrementFactory from 'mongoose-sequence';

const connection = mongoose.connection;
const autoIncrement = AutoIncrementFactory(connection);

const userSchema = new Schema({
    uid: {type: Number, unique: true, default: 0},
    username: {type: String, unique: true},
    password: {type: String, bcrypt: true},
    email: {type: String, unique: true},
    registerDate: {type: Number, default: Date.now()},
    avatarName: {type: String, default: "defaultAvatar.png"},
    balance: {type: Number, default: 0},
    admin: {type: Boolean, default: false},
    support: {type: Boolean, default: false},
    banned: {type: Boolean, default: false},
});
try {
    userSchema.plugin(autoIncrement, {inc_field: "uid"});
} catch(e) {
    console.error(e);
}

export default mongoose.models.User || mongoose.model('User', userSchema);

