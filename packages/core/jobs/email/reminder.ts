import { Model, Schema, Types } from "mongoose"
import { JobDocument, JobInput, JobModel } from "@ts.app/core/models/job.js"
import { Email, EmailInput } from "@ts.app/core/common/email.js"
import { EmailConfigModel } from "@ts.app/core/models/config/email.js"

export const pack = "@ts.app/core"
export const type = "EmailRemainder"
export const discriminator = `${pack}:${type}`

export type JobParams = {
    email_config_id: Types.ObjectId,
    email: EmailInput
}

export type JobData = {
    msg_id: Types.ObjectId
}

export interface EmailRemainderInput extends JobInput<JobParams> {}

export interface EmailRemainderDocument extends JobDocument<JobParams, JobData> {
    type: typeof type
    pack: typeof pack
}

const emailRemainderSchema = new Schema<EmailRemainderDocument, Model<EmailRemainderDocument>, EmailRemainderDocument>({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    params: { type: Schema.Types.Mixed, required: true, index: true },
    data: {
        msg_id: { type: Schema.Types.ObjectId, required: false, index: true }
    }
})

emailRemainderSchema.methods.onTick = async function() {
    const email_config = await EmailConfigModel.findById(this.params.email_config_id)
    if (!email_config) throw new Error(`EmailConfig not found with id: ${this.params.email_config_id}`)
    const message = await new Email(this.params.email).send(email_config)
    this.data.msg_id = message._id
}

export const EmailRemainderModel = JobModel.discriminator(discriminator, emailRemainderSchema)