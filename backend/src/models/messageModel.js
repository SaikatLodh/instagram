import mongoose, { Schema } from "mongoose"

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    message: {
        type: String,
        required: true
    }
},

    { timestamps: true })

export const Message = mongoose.model("message", messageSchema)