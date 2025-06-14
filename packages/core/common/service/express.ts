import { TypeStack } from "@ts.app/core/common/cli/typestack.js"
import express from "express"

await TypeStack.init()
.then(async (config) => {
    const { upsertRouterDocs } = await import("@ts.app/core/models/user/access/middleware.js")
    const { expressLoader } = await import("@ts.app/core/common/service/loader/express.js")

    const app = express()
    const server = app.listen({port: 8000})
    app.use(express.json({ limit: "100mb" }))
    app.use(express.urlencoded({ extended: true , limit: "100mb" }))

    // load express routers
    const {docs, router} = await expressLoader(config, server)
    app.use(router)

    // update router docs in db
    for (const [pack_key, router] of docs) {
        upsertRouterDocs(router)
    }
})