import tscore, { TypeStack, GraphqlContext, GraphqlRouter, IResolvers, IPackageOptions } from "@ts.app/core"

export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

router.resolvers.Query.getAllPackageConfigs = {
    access: tscore.config.access.Pack.getAllPackageConfigs,
    resolve: async (parent, args, context, info) => 
        Object.entries(TypeStack.config.packages).map(([key, pack]) => {
            return {
                pack: pack.pack.json.name,
                version: pack.pack.json.version,
                alias: pack.alias,
                haproxy_rewrite: pack.options.haproxy_rewrite,
                next_disable_alias: pack.options.next_disable_alias,
            } satisfies IPackageOptions
        })
}