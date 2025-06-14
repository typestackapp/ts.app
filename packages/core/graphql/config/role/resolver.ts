import { RoleConfigModel } from "@ts.app/core/models/config/role.js"
import tscore, { GraphqlContext, GraphqlRouter, IResolvers} from "@ts.app/core"

export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

router.resolvers.Query.getAllRoles = {
    access: tscore.config.access.RoleConfig.getAllRoles,
    resolve: async (parent, args, context, info) => RoleConfigModel.find()
}