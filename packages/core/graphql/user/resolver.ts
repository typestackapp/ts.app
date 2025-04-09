import tscore, { GraphqlContext, GraphqlRouter } from "@ts.app/core"
import { UserModel } from "@ts.app/core/models/user.js"
import { getCurrentUser, getUser } from "@ts.app/core/graphql/user/schema.js"
import { IResolvers } from "@ts.app/core"
import { RoleConfigModel } from "@ts.app/core/models/config/role.js"

export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

router.resolvers.Query.getCurrentUser = {
    typedef: getCurrentUser,
    access: tscore.config.access.User.getCurrentUser,
    resolve: async (parent, args, context, info) => {
        if(!context.req.user) return null
        return { ...context.req.user.toJSON(), role: null }
    }
}

router.resolvers.Query.getUser = {
    typedef: getUser,
    access: tscore.config.access.User.getUser,
    resolve: async (parent, args, context, info) => {
        if(!args?.id) throw `Args, undefined user id`
        const user = await UserModel.findById(args.id)
        if(!user) return null
        return { ...user.toJSON(), role: null }
    }
}

router.resolvers.UserOutput.roles = {
    access: tscore.config.access.User.getUserRole,
    resolve: async (parent, args, context, info) => {
        if(!context.req.user) return null
        const roles = await RoleConfigModel.find({ "data.name": { $in: context.req.user.roles } })
        if(!roles || roles.length === 0) return null
        return roles.map( role => role.toJSON() )
    }
}