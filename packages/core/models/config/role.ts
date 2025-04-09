import { IRoleConfigInput } from "@ts.app/core"
import { accessSchema } from "@ts.app/core/models/user/access.js"
import { ConfigModel, ConfigInput } from "@ts.app/core/models/config.js"
import { Model, Schema, Document } from 'mongoose'
import { MongooseDocument } from "@ts.app/core/models/util.js"

export const pack = "@ts.app/core"
export const type = "RoleConfig"
export const discriminator = `${pack}:${type}`

export type RoleConfigInput = IRoleConfigInput

export type RoleConfigDocument = RoleConfigInput & MongooseDocument & {
    type: typeof type
    pack: typeof pack
}

const roleConfigSchema = new Schema({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    data: {
        name: { type: String, required:true, index: true },
        resource_access: { type: [accessSchema], required: true, index: true },
        graphql_access: { type: [Schema.Types.Mixed], required: true, index: true },
    }
})

export const RoleConfigModel = ConfigModel.discriminator<RoleConfigDocument>(discriminator, roleConfigSchema) 