import { TypeStack } from "@ts.app/core/common/cli/typestack.js"
import compression from 'compression'
import express from 'express'

await TypeStack.init()
.then(async (config) => {
    const { upsertRouterDocs } = await import("@ts.app/core/models/user/access/middleware.js")
    const { graphqlLoader } = await import("@ts.app/core/common/service/loader/graphql.js")
    const app = express().use(compression())
    const server = app.listen({ port: 8002 })

    // load graphql routers
    const {docs, router} = await graphqlLoader(server)
    app.use(router)

    // update router docs in db
    upsertRouterDocs(docs)
})