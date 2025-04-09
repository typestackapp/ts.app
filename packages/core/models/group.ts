import tscore from "@ts.app/core"
import mongoose, { ObjectId, Schema, Types } from "mongoose"

export interface GroupInput<TData> {
    data: TData
}

export interface GroupDocument<TData> extends mongoose.Document, GroupInput<TData> {
    pack: string
    type: string
    createdAt: Date
    updatedAt: Date
}

export const groupSchema = new Schema<GroupDocument<any>>({
    data: { type: Schema.Types.Mixed, index: true }
}, { timestamps: true, discriminatorKey: 'pack' })

export const GroupModel = tscore.db.mongoose.core.model<GroupDocument<any>>("groups", groupSchema)