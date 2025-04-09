import tscore from "@ts.app/core";
import mongoose, { ObjectId, Schema, Types } from "mongoose"

export interface UserInfoInput<TData> {
    data: TData
}

export interface UserInfoDocument<TData> extends mongoose.Document, UserInfoInput<TData> {
    pack: string
    type: string
    createdAt: Date
    updatedAt: Date
}

export const userInfoSchema = new Schema<UserInfoDocument<any>>({
    data: { type: Schema.Types.Mixed, index: true }
}, { timestamps: true, discriminatorKey: 'pack' })

export const UserInfoModel = tscore.db.mongoose.core.model<UserInfoDocument<any>>("user_info", userInfoSchema)