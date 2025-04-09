import { Schema, Document, Model, Types } from "mongoose"

export interface MongooseDocument<T = Types.ObjectId> extends Document {
    _id: T
}