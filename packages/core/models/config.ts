import { Schema, Document } from 'mongoose'
import tscore, { type IConfigInput, type IConfigDocument, type IConfigBase  } from '@ts.app/core'
import { LogOptions, logOptionsSchema } from '@ts.app/core/models/log.js'
import { MongooseDocument } from "@ts.app/core/models/util.js"

export type ConfigInput = IConfigInput
export type ConfigBase = IConfigBase

export type ConfigDocument = MongooseDocument & IConfigDocument & {
    log: LogOptions
}

const configSchema = new Schema<ConfigDocument>({
    title: { type: String, required: true, index: true  },
    data: { type: Schema.Types.Mixed, index: true },
    log: { type: logOptionsSchema, index: true, required: true, default: {} },
    created_by: { type: Schema.Types.ObjectId, ref:'users', required: true, index: true },
    updated_by: { type: Schema.Types.ObjectId, ref:'users', index: true },
},{ timestamps: true } )

configSchema.pre<ConfigDocument>('save', async function(next) {
    await this.log.add(this)
    next()
})

configSchema.pre('findOneAndUpdate', async function(next) {
    const config = await this.model.findOne(this.getQuery()) as unknown as ConfigDocument | null
    if (config) await config.log.add(config)
    next()
})

configSchema.index(
    { title: "text", data: "text", type: "text" },
    { name: "config_search_index" }
)

export const ConfigModel = tscore.db.mongoose.core.model<ConfigDocument>("configs", configSchema)