import tscore from "@ts.app/core";
import { MongooseDocument } from "@ts.app/core/models/util.js";
import { Schema, Types } from 'mongoose'

export interface MessageInput<TData> {
    data: TData
}

export interface MessageDocument<TData> extends MongooseDocument, MessageInput<TData> {
    pack: string
    type: string
    createdAt: Date
    updatedAt: Date
}

const messageSchema = new Schema<MessageDocument<any>>({
    data: { type:Schema.Types.Mixed, index:true },
},{ timestamps: true })

export const MessageModel = tscore.db.mongoose.core.model<MessageDocument<any>>("messages", messageSchema)