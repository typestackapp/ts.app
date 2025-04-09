import tscore from "@ts.app/core"
import mongoose, { ObjectId, Schema, Types } from "mongoose"

export interface ChunkInput {
  files_id: ObjectId
  n: number
  data: Buffer
}

export interface ChunkDocument extends mongoose.Document, ChunkInput {
  files_id: ObjectId
  n: number
  data: Buffer
  files: any
  createdAt: Date
  updatedAt: Date
}

export const chunkSchema = new Schema<ChunkDocument>({
  files_id: { type: Schema.Types.ObjectId, index: true },
  n: { type: Number, index: true },
  data: { type: Buffer, index: true }
}, { timestamps: true })

export const ChunkModel = tscore.db.mongoose.core.model<ChunkDocument>("chunks", chunkSchema)