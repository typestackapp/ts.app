import tscore from "@ts.app/core"
import { Types, Schema, Document, ClientSession } from "mongoose"

// export const transaction = async (session: ClientSession, update: UpdateDocument) => {
export type Transaction = (session: ClientSession, update: UpdateDocument) => Promise<void>

export interface UpdateInput {
    pack: string
    version: string
    log: UpdateLogInput[]
}

export interface UpdateLogInput {
    type: string,
    msg: string | undefined
}

export interface UpdateDocument extends UpdateInput, Document {}

export const updateLogSchema = new Schema<UpdateLogInput>({
    type: { type: String, required: true, unique: false, index: true },
    msg: { type: String, required: false, unique: false, index: true }
},{ _id: false, timestamps: true })

export const updateSchema = new Schema<UpdateDocument>({
    pack: { type: String, required: true, unique: false, index: true },
    version: { type: String, required: true, unique: false, index: true },
    log: { type: [updateLogSchema], required: true, unique: false, index: true }
},{ timestamps:true })

export const UpdateModel = tscore.db.mongoose.core.model<UpdateDocument>('updates', updateSchema)