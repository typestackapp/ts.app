import tscore from "@ts.app/core"
import mongoose, { Model, Schema, Document, Types } from "mongoose"

export type AppAction = 
| "login" // allows user to login via app
| "register" // allows user to register via app
| "grant" // allows user to grant access to app

export type AppInput<ClientPath extends string = string, Data = any> = {
    _id?: mongoose.Types.ObjectId
    data: Data
    actions?: AppAction[]
    client: ClientPath
    name: string
    icon: string
    description: string
    created_by: mongoose.Types.ObjectId
    updated_by: mongoose.Types.ObjectId
}

export type AppDocument<ClientPath extends string = string, Data = any> = Document<Types.ObjectId> & AppInput<ClientPath, Data> & {
    _id: Types.ObjectId
    actions: AppAction[]
}

export const appSchema = new Schema<AppDocument, Model<AppDocument>, AppDocument>({
    data: { type: Schema.Types.Mixed, required: true, index: true },
    actions: { type: [String], required: true, index: true, default: [] },
    client: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    icon: { type: String, required: true, index: true },
    description: { type: String, required: true, index: true },
    created_by: { type: Schema.Types.ObjectId, required: true, index: true },
    updated_by: { type: Schema.Types.ObjectId, required: true, index: true },
}, { timestamps: true })

appSchema.index(
    { data: "text", type: "text" },
    { name: "app_search_index" }
)

export const AppModel = tscore.db.mongoose.core.model<AppDocument>('user_apps', appSchema)