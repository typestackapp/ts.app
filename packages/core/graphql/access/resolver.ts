import tscore, { TypeStack, GraphqlContext, GraphqlRouter, IResolvers } from "@ts.app/core"

const access = tscore.config.access
export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

router.resolvers.Query.getAllAccessConfigs = {
    access: tscore.config.access.Access.getAllAccessConfigs,
    resolve: async (parent, args, context, info) => TypeStack.config
}