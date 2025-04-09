import tscore from "@ts.app/core"
import mongoose, { ObjectId, Schema, Types } from "mongoose"

export interface GroupEntryInput<TData> {
    data: TData
    group_id: ObjectId
}

export interface GroupEntryDocument<TData> extends mongoose.Document, GroupEntryInput<TData> {
    pack: string
    type: string
    createdAt: Date
    updatedAt: Date
}

export const groupEntrySchema = new Schema<GroupEntryDocument<any>>({
    data: { type: Schema.Types.Mixed, index: true }
}, { timestamps: true, discriminatorKey: 'pack' })

export const GroupEntryModel = tscore.db.mongoose.core.model<GroupEntryDocument<any>>("group_entries", groupEntrySchema)