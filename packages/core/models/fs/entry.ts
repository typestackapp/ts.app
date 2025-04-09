import { GroupEntryInput, GroupEntryModel } from "@ts.app/core/models/group/entry.js"
import { Document, Schema, ObjectId } from 'mongoose'

export const pack = "@ts.app/core/fs"
export const type = "FileGroupEntry"
export const discriminator = `${pack}:${type}`

export type FileGroupEntryInput = GroupEntryInput<{
    file_id: Schema.Types.ObjectId
}>

export interface FileGroupEntryDocument extends FileGroupEntryInput, Document {
    type: typeof type
    pack: typeof pack
}

const fileGroupEntrySchema = new Schema({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    data: {
        file_id: { type: Schema.Types.ObjectId, required: true, index: true },
    }
})

export const FileGroupEntryModel = GroupEntryModel.discriminator<FileGroupEntryDocument>(discriminator, fileGroupEntrySchema) 