import { AppInput, AppModel, AppDocument, AppAction } from "@ts.app/core/models/user/app.js"
import { Schema, Model } from 'mongoose'
import { IAccessInput } from '@ts.app/core/codegen/admin/index.js'
import { accessSchema } from '@ts.app/core/models/user/access.js'
import { Client, ClientOptions } from '@ts.app/core/models/user/app/oauth/client.js'

export const pack = "@ts.app/core"
export const type = "UserOauthApp"
export const discriminator = `${pack}:${type}`

// https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/endpoints
export type GrantType = 
| "authorization_code" // Complete the Authorization Code Grant Request
| "refresh_token" // Refresh Token Grant Request, use Bearer ${refresh_token} to get new token
| "client_credentials" // Client Credentials Grant Request, use Basic base64(${client_id}:${client_secret}) to get token
| "password" // Resource Owner Password Credentials Grant Request, use Basic base64(${email}:${password}) to get token
//TODO| "password_2fa_sms" use Basic + 2fa sms code to get token
//TODO| "password_2fa_email" use Basic + 2fa email code to get token
//TODO| "password_2fa_sms_email" use Basic + 2fa sms + email code to get token
| "session" // Retrive app token from session, only if created via password grant

export type OauthGrant = {
    type: GrantType // grant type allowed for this app 
}

export interface OauthAppData extends ClientOptions {
    client_id: string // id for client_credentials grant
    client_secret: string // secret for client_credentials grant
    access: IAccessInput[] // limits app access to user resources, will be used when generating app oauth tokens
    grants: OauthGrant[] // grants that can be used by user or client
    roles: string[] // list of roles that can sign up to this app
    callback_url: string // app retrives token from oauth server
    redirect_url: string // ridirect user when app access is granted
    token_url?: string // retrive token from oauth server
}

export interface OauthAppInput<ClientPath extends string = string> extends AppInput<ClientPath, OauthAppData> {}

export interface OauthAppDocument<ClientPath extends string = string> extends AppDocument<ClientPath, OauthAppData> {
    getClient(): Promise<Client | undefined>
    type: typeof type
    pack: typeof pack
}

export const oauthGrantSchema = new Schema<OauthGrant>({
    type: { type: String, required: true, index: true }
}, { _id: false, timestamps: true })

export const oauthAppSchema = new Schema<OauthAppDocument, Model<OauthAppDocument>, OauthAppDocument>({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    data: {
        client_id: { type: String, required: true, index: true, unique: true },
        client_secret: { type: String, required: true, index: true },
        access: { type: [accessSchema], required: false, index: true },
        grants: { type: [oauthGrantSchema], required: false, index: true },
        roles: { type: [String], required: false, index: true },
        callback_url: { type: String, required: true, index: true },
        redirect_url: { type: String, required: true, index: true },
        token_url: { type: String, required: false, index: true },
    },
})

oauthAppSchema.methods.getClient = async function(){
    const oauthApp = this as OauthAppDocument
    const module = await import(oauthApp.client)
    if(!module.default) return undefined
    const ClientClass = module.default as any
    return new ClientClass(oauthApp.data)
}

export const OauthAppModel = AppModel.discriminator<OauthAppDocument>(discriminator, oauthAppSchema) 