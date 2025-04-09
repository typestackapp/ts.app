import { Types, Schema, Document, Model } from "mongoose"
import tscore, { IUserInput, IUserDocument as IUserDocument } from "@ts.app/core"
import { RoleConfigDocument, RoleConfigModel } from "@ts.app/core/models/config/role.js"
import { checkRolesAccessToGraphqlService } from "@ts.app/core/models/user/access/util.js"
import { GraphqlServerOutput } from "@ts.app/core/common/cli/typedefs.js"

export type UserInput = IUserInput

export type UserDocument = IUserDocument & Document<Types.ObjectId> & {
    haveAccessToGraphqlService(options: GraphqlServerOutput): Promise<{user: UserDocument, roles: RoleConfigDocument[]}>
}

export const userSchema = new Schema<UserDocument, Model<UserDocument>, UserDocument>({
    usn: { type: String, required: true, unique: true, index: true },
    psw: { type: String, required: true },
    roles: { type: [String], required: true, index: true }
},{ timestamps:true })

userSchema.methods.haveAccessToGraphqlService = async function(options: GraphqlServerOutput) {
    const user = this as unknown as UserDocument
    // search if user.roles is in RoleConfigModel
    const roleConfigs = await RoleConfigModel.find({ "data.name": { $in: user.roles } })
    if (!roleConfigs || roleConfigs.length === 0) throw `Role ${user.roles.toString()} not found`
    await checkRolesAccessToGraphqlService(roleConfigs, options)
    return { user, roles: roleConfigs }
}

export const UserModel = tscore.db.mongoose.core.model('users', userSchema, "users")