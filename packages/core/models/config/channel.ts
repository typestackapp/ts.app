import { Options } from "amqplib"
import { Schema, Document, Model } from "mongoose"
import { ConfigInput, ConfigModel } from "@ts.app/core/models/config.js"
import { ConsumerInput, consumerSchema } from "@ts.app/core/models/config/consumer.js"
import { MongooseDocument } from "@ts.app/core/models/util.js"

export const pack = "@ts.app/core"
export const type = "ChannelConfig"
export const discriminator = `${pack}:${type}`

export type ChannelOptions = {
    channel?: {
        prefetch?: { // max count of messages to be processed at the same time for:
            channel?: number, // single channel
            global?: number // all channels
        }
    },
    queue?: Options.AssertQueue // queue options
    publish?: Options.Publish // publish to queue options
}

export interface ChannelConfigInput extends ConfigInput {
    data: {
        options?: ChannelOptions,
        consumers: ConsumerInput[]
        services: string[] // start all queue consumers on these services
        pack: string // consumer package
        type: string // consumer type
        path: string // consumer path
    }
}

export type ChannelConfigDocument = ChannelConfigInput & MongooseDocument & {
    pack: typeof pack
    type: typeof type
}

const channelConfigSchema = new Schema({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    data: {
        services: { type: [String], required: true },
        options: { type: Schema.Types.Mixed, required: false },
        type: { type: String, required: true },
        consumers: { type: [consumerSchema], required: true },
        pack: { type: String, required: true, index: true },
        path: { type: String, required: true, index: true },
    }
})

export const ChannelConfigModel = ConfigModel.discriminator<ChannelConfigDocument>(discriminator, channelConfigSchema) 