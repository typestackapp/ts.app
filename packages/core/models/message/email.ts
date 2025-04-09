import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { Schema, Types } from "mongoose"
import { MessageModel, MessageInput, MessageDocument } from "@ts.app/core/models/message.js"
import { EmailOptions } from '@ts.app/core/common/email.js'

export const pack = "@ts.app/core"
export const type = "EmailMessage"
export const discriminator = `${pack}:${type}`

export interface IEmailMessage {
    email: string[]
    html?: string
    error?: string
    res?: SMTPTransport.SentMessageInfo,
    bounce?: any
    options?: EmailOptions
}

export interface EmailMessageInput extends MessageInput<IEmailMessage> {
    _id: Types.ObjectId
}

export interface EmailMessageDocument extends MessageDocument<IEmailMessage>, EmailMessageInput {
    pack: typeof pack
    type: typeof type
}

const emailMssageSchema = new Schema({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    data: {
        email: { type: [String], required: true },
        html: { type: String, required: false },
        error: { type: String, required: false },
        res: { type: Schema.Types.Mixed, required: false },
        bounce: { type: Schema.Types.Mixed, required: false },
        options: { type: Schema.Types.Mixed, required: false }
    }
})

export const EmailMessageModel = MessageModel.discriminator<EmailMessageDocument>(discriminator, emailMssageSchema)