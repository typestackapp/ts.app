import { GraphqlContext, GraphqlRouter } from "@ts.app/core"
import { IResolvers } from "@ts.app/dev/codegen/system/index.js"
import tsdev from "@ts.app/dev"

export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

router.resolvers.Query.getPing = {
    access: tsdev.config.access.Test.getPing,
    resolve: async (parent, args, context, info) => true
}