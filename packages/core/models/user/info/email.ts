import { UserInfoDocument, UserInfoInput, UserInfoModel } from "@ts.app/core/models/user/info.js"
import { ObjectId, Schema, Types } from 'mongoose'

export const pack = "@ts.app/core"
export const type = "UserEmailInfo"
export const discriminator = `${pack}:${type}`

export interface IUserEmailInfo {
    email: string
    created_by: ObjectId
    updated_by?: ObjectId
}

export interface UserEmailInfoInput extends UserInfoInput<IUserEmailInfo> {}

export interface UserEmailInfoDocument extends UserInfoDocument<IUserEmailInfo>, UserEmailInfoInput {
    pack: typeof pack
    type: typeof type
}

const userEmailInfoSchema = new Schema({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    data: {
        email: { type: String, required:true },
        created_by: { type: Types.ObjectId, index: true, required: true, ref: "users" },
        updated_by: { type: Types.ObjectId, index: true, required: false, ref: "users" },
    }
})

export const UserEmailInfoModel = UserInfoModel.discriminator<UserEmailInfoDocument>(discriminator, userEmailInfoSchema)