import { GraphqlContext, GraphqlRouter } from "@ts.app/core"
import { IResolvers } from "@ts.app/dev/codegen/system/index.js"
import tscore from "@ts.app/core"

export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

router.resolvers.Query.getPing = {
    access: tscore.config["@ts.app/dev"].access.Test.getPing,
    resolve: async (parent, args, context, info) => true
}