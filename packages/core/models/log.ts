import { Schema, Document, Model, Types, FlattenMaps } from "mongoose"
import tscore, { type ILogOptions, type ILogOptionsInput } from "@ts.app/core"
import type { MongooseDocument } from "@ts.app/core/models/util.js"

/**
 * Usage:
 * Only use LogModel.add with schema.post('save'|'findOneAndUpdate'|'updateOne','updateMany')
 *  - Calling schema.pre('save'|'validate') will not work
 *  - Document should be available in database when calling LogModel.add
 *  - You do not need to call schema.pre('remove') to log document copy is already saved with post hooks
 * log.enabled - enable/disable logging
 * log.max - maximum number of logs to keep
 */

export interface LogOptions extends ILogOptions {
    add(doc: Document): Promise<null | LogDocument>
}
export interface LogOptionsInput extends ILogOptionsInput {}
export const logOptionsSchema = new Schema<LogOptions, Model<LogOptions>, LogOptions>({
    enabled: { type: Boolean, required: true, index: true, default: true },
    max: { type: Number, required: false, index: true, default: 1000 },
},{ _id: false })

export type LogInput = {
    doc: FlattenMaps<MongooseDocument>
}

export interface LogDocument extends LogInput {
    collectionName?: string
    modelName?: string
}

export const logSchema = new Schema<LogDocument, Model<LogDocument>, LogDocument>({
    doc: { type: Schema.Types.Mixed, required: true, index: true },
    collectionName: { type: String, required: false, index: true },
    modelName: { type: String, required: false, index: true },
}, { timestamps: true })

logSchema.pre('validate', function(next) {
    this.collectionName = this.doc?.collection?.collectionName as string
    const constructor = this.doc?.constructor as unknown as Model<Document>
    this.modelName = constructor.modelName   
    this.doc = this.doc.toJSON() // remove reference to original document
    next()
})

logOptionsSchema.methods.add = async function(doc) {
    if(this.max) {
        // get total count of documents
        const count = await LogModel.countDocuments({'doc._id': doc._id})

        // if count is greater than max, remove oldest documents
        if (count >= this.max) {
            const docs = await LogModel.find({'doc._id': doc._id}).sort({createdAt: 1}).limit(count - this.max + 1)
            await LogModel.deleteMany({ _id: { $in: docs.map(doc => doc._id) }})
        }
    }

    if (this.enabled) {
        const DocModel = doc.constructor as unknown as Model<Document>
        const db_version_of_doc = await DocModel.findById(doc._id)
        if (!db_version_of_doc) {
            console.error(`LogModel: Document not found in: ${DocModel.modelName}: ${doc._id}. Skipping log entry.`)
            return null
        }
        return await LogModel.create({doc: db_version_of_doc})
    }

    return null
}

export const LogModel = tscore.db.mongoose.core.model<LogDocument, Model<LogDocument>>('logs', logSchema)