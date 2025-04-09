import { MongooseDocument } from "@ts.app/core/models/util.js"
import { ConfigInput, ConfigModel } from "@ts.app/core/models/config.js"
import { Model, Schema, Document, Types } from 'mongoose'
import { JWK } from 'jose'
import { GraphObj } from "@ts.app/core"

export const pack = "@ts.app/core"
export const type = "JWKConfig"
export const discriminator = `${pack}:${type}`

// see BearerKeyOptions
export interface AccessTokenJWKData {
    renewBefore: string // (30s 1h, 1d, 1y, etc), allow token to be renewed before it expires
    extendTime: string // (30s 1h, 1d, 1y, etc), allow token lifetime to be extended by this amount
    headerAlg: "RS256" | "HS256" // (RS256, HS256, etc)
}

export interface RefreshTokenJWKData extends AccessTokenJWKData {
    renewAfter: string // (30s 1h, 1d, 1y, etc), allow refresh token to be renewed after issued time + renewAfter
    extendLifeTime: boolean  // should refresh token lifetime be extended
}

export interface JWKConfigInput<Data extends GraphObj> extends ConfigInput {
    data: Data
    key: JWK
    cacheSeconds: number
}

export type JWKConfigDocument<Data extends GraphObj> = JWKConfigInput<Data> & MongooseDocument & {
    pack: typeof pack
    type: typeof type
}

const JWKConfigSchema = new Schema({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    data: { type: Schema.Types.Mixed, required: true, index: true },
    key: { type: Schema.Types.Mixed, required: true, index: true },
    cacheSeconds: { type: Number, required: true, index: true },
})

export const JWKConfigModel = ConfigModel.discriminator<JWKConfigDocument<any>>(discriminator, JWKConfigSchema)

export class JWKCache {
    private static cache: {
        [key: string]: {
            key: JWKConfigDocument<any>,
            expires: number
        }
    } = {}

    public static async get<TData extends GraphObj = {}>(_id: string | Types.ObjectId): Promise<JWKConfigDocument<TData>> {
        const cached = this.cache[_id.toString()]
        if (cached && cached.expires > Date.now()) {
            //console.log(`JWKConfig cache hit for jwk:${_id}`)
            return cached.key
        }
        
        const key = await JWKConfigModel.findById(_id)
        //console.log(`JWKConfig cache miss and jwk:${_id} ${key ? "found" : "not found"}`)
        if (!key) throw new Error(`JWKConfig not found with id: ${_id}`)
        
        this.cache[_id.toString()] = {
            key,
            expires: Date.now() + key.cacheSeconds * 1000
        }
        return key
    }
}