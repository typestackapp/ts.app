import tscore from "@ts.app/core"
import mongoose, { ObjectId, Schema, Types } from "mongoose"

export interface FileInput {
  filename: string
  contentType: string
  length: number
  chunkSize: number
  md5: string
  metadata: any
}

export interface FileDocument extends mongoose.Document, FileInput {
  filename: string
  contentType: string
  length: number
  chunkSize: number
  md5: string
  metadata: any
  createdAt: Date
  updatedAt: Date
}

export const fileSchema = new Schema<FileDocument>({
  filename: { type: String, index: true },
  contentType: { type: String, index: true },
  length: { type: Number, index: true },
  chunkSize: { type: Number, index: true },
  md5: { type: String, index: true },
  metadata: { type: Schema.Types.Mixed, index: true }
}, { timestamps: true })

export const FileModel = tscore.db.mongoose.core.model<FileDocument>("files", fileSchema)