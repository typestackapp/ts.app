import mongoose, { Document, Model, Schema, Types } from "mongoose"
import { IAccessInput, ITokenType} from '@ts.app/core'
import { IAccessDocument, IServerAccess, IAccessOptions } from '@ts.app/core'
import { Request, Response, NextFunction } from "express"
import tscore from "@ts.app/core"
import { CaptchaResponse } from "@ts.app/core/models/user/access/middleware.js"
import { Serialize } from "@trpc/server/shared"

export type { Request, Response, NextFunction }

export type AccessInput = IAccessInput
export type AccessOptions = IAccessOptions
export type AccessOutput = Serialize<AccessInput>
export type AccessDocument = Document & IAccessDocument & {}

export interface UserDevice {
    ip_address?: string
    agent?: string
}

export interface AccessLogInfo {
    type: string,
    msg: string | undefined
}

export interface AccessLogUser {
    id: mongoose.Types.ObjectId
    token_id?: mongoose.Types.ObjectId | string
    token_type: ITokenType
}

export interface UserAccessInput {
    version: string
    pack: string
    server: IServerAccess
    access?: IAccessOptions
}

export interface UserAccessLogInput {
    req_id: mongoose.Types.ObjectId
    device: UserDevice
    access?: IAccessOptions
    access_id?: mongoose.Types.ObjectId
    user?: AccessLogUser
    captcha?: CaptchaResponse
    info?: AccessLogInfo[]
}

export type UserAccessLogDocument = UserAccessLogInput & Document & {
    info: AccessLogInfo[]
    addInfo: (type: string, msg?: string) => Promise<void>
    createdAt: Date
    updatedAt: Date
}

export type UserAccessDocument = UserAccessInput & Document<Types.ObjectId> & {
    createdAt: Date
    updatedAt: Date
}

export const userDeviceSchema = new Schema<UserDevice>({
    ip_address: { type: String, index: true },
    agent: { type: String, required: false },
}, { _id : false })

export const accessLogInfoSchema = new Schema<AccessLogInfo>({
    type: { type: String, index: true, required: true },
    msg: { type: String, index: true, required: false },
}, { _id : false })

export const accessLogUserSchema = new Schema<AccessLogUser>({
    id: { type: Schema.Types.ObjectId, ref: 'users', index: true, required: true },
    token_id: { type: Schema.Types.ObjectId, index: true, required: false },
    token_type: { type: String, index: true, required: true },
}, { _id : false })

export const userAccessLogSchema = new Schema<UserAccessLogDocument, Model<UserAccessLogDocument>, UserAccessLogDocument>({
    req_id: { type: Schema.Types.ObjectId, index: true, required: true },
    device: { type: userDeviceSchema, index: true, required: true },
    access: { type: Object, index: true, required: false },
    access_id: { type: Schema.Types.ObjectId, index: true, required: false },
    user: { type: accessLogUserSchema, index: true, required: false },
    captcha: { type: Object, index: true, required: false },
    info: { type: [accessLogInfoSchema], index: true, required: false, default: [] }
}, { timestamps: true })

export const accessSchema = new Schema<AccessDocument, Model<AccessDocument>, AccessDocument>({
    status: { type: String, index: true, required: true },
    pack: { type: String, index: true, required: true },
    resource: { type: String, index: true, required: false },
    action: { type: String, index: true, required: false },
    permissions: { type: [String], index: true, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'users', index: true, required: false },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users', index: true, required: false },
}, { timestamps: true, _id : false })

export const userAccessSchema = new Schema<UserAccessDocument, Model<UserAccessDocument>, UserAccessDocument>({
    pack: { type: String, index: true, required: true },
    version: { type: String, index: true, required: true },
    server: { type: Object, index: true, required: true },
    access: { type: Object, index: true, required: false },
}, { timestamps: true })

userAccessLogSchema.methods.addInfo = async function(type: string, msg?: string) {
    const info: AccessLogInfo = { type, msg }
    this.info.push(info)
}

export const AccessModel = mongoose.model('access', accessSchema)
export const UserAccessModel = tscore.db.mongoose.core.model('user_access', userAccessSchema, 'user_access')
export const UserAccessLogModel = tscore.db.mongoose.core.model('user_access_logs', userAccessLogSchema)