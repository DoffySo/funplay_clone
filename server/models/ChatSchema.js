import mongoose, { Schema } from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const connection = mongoose.connection;
const autoIncrement = AutoIncrementFactory(connection)

// Схема вложений
const attachmentSchema = new Schema({
    type: String,
    url: String,
});

// Схема сообщений
const messageSchema = new Schema({
    senderuid: {type: Number},
    message: {type: String},
    attachments: [attachmentSchema],
});

// Схема чатов
const chatSchema = new Schema({
    chatid: {type: Number, unique: true, default: 0},
    users: [Number], // список uid пользователей
    messages: [messageSchema], // массив сообщений
    date: {type: Number, default: Date.now()}
});

try {
    chatSchema.plugin(autoIncrement, {inc_field: "chatid"});
} catch(e) {
    console.error(e);
}

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
