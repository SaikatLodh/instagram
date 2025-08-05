import mongoose, { Schema } from "mongoose"

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'message'
    }]
},
    { timestamps: true })

export const Conversation = mongoose.model("conversation",conversationSchema)    