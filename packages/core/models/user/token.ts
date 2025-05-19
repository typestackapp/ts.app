import { Model, Schema, Types, Document } from "mongoose"
import tscore from "@ts.app/core"
import { Serialize } from "@trpc/server/unstable-core-do-not-import"

export type TokenStatus =
| "initilized" // token is created but callback is not received from provider
| "active" // token is ok to use
| "expired" // token has expired by expires_at date, this is not the same as token expiration date
| "revoked" // token has been revoked by user


export type TokenInput<Data extends {} | undefined = {}> = {
    _id?: Types.ObjectId
    app_id?: Types.ObjectId
    user_id: Types.ObjectId
    status: TokenStatus
    expires_at?: Date // if not set, token never expires | after x date token status is set to expired
    remove_at?: Date // if not set, token never gets removed | after x date token is deleted
    data?: Data
    created_at?: Date
    updated_at?: Date
}

export type TokenDefaults = {
    _id: Types.ObjectId
    pack: string
    type: string
    created_at: Date
    updated_at: Date
}

export type TokenOutput = Serialize<TokenInput & TokenDefaults>
export type TokenDocument = Document<Types.ObjectId> & TokenInput & TokenDefaults & {
    _id: Types.ObjectId
}

export const tokenSchema = new Schema<TokenDocument, Model<TokenDocument>, TokenDocument>({
    app_id: { type: Schema.Types.ObjectId, index: true, required: false},
    user_id: { type: Schema.Types.ObjectId, index: true, required: true},
    status: { type: String, index: true, required: true },
    expires_at: { type: Date, index: true, required: false },
    remove_at: { type: Date, index: true, required: false },
    data: { type: Schema.Types.Mixed, index: true, required: false },
}, { timestamps: true })

export const TokenModel = tscore.db.mongoose.core.model('user_tokens', tokenSchema, 'user_tokens')