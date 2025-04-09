import { Options } from "amqplib"
import { Schema, Types } from "mongoose"

export interface ConsumerInput {
    _id: Types.ObjectId
    options?: Options.Consume
}

const consumerSchema = new Schema({
    options: { type: Schema.Types.Mixed, required: false },
})

export { consumerSchema }