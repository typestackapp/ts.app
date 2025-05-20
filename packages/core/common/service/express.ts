import { TypeStack, ExpressRouter, ExpressResponse, IExpressRouter } from "@ts.app/core"
import { tsapp, certbot } from "@ts.app/core/configs/env.js"
import fs from "fs"
import express, { Router } from "express"
import http from "http"


export async function expressLoader(server: http.Server) {
    const { middleware } = await import("@ts.app/core/models/user/access/middleware.js")

    const router: Router = express.Router()
    const docs: Map<string, IExpressRouter[]> = new Map()

    for (const [pack_alias, pack] of Object.entries(TypeStack.config.packages)) {
        const pack_key = pack.pack.json.name
        const _root = `${process.cwd()}/node_modules/${pack_key}/dist/esm/express/`

        if(!fs.existsSync(_root)) continue

        const routers = new ExpressRouter()
        const _routers = await routers.loadExpressRoutes(_root, pack_key, `/api`).catch(error => {
            console.log(`ERROR while loading api routes from pack: ${pack_key}: ${error}`)
            return []
        })

        // add middleware to each handler
        for(const _router of _routers) {
            
            // wrap each handler with try catch and return ErrorResponse if one off handler throws error
            for(const [index, handler] of _router.handlers.entries()) {
                _router.handlers[index] = async (req, res, next) => {
                    try {
                        await handler(req, res, next)
                    } catch (error) {
                        const response: ExpressResponse = {
                            error: { code: `unknown`, msg: `Error ${_router.options?.resourceAction}:${index} , ${error}`}
                        }
                        res.send(response)
                    }
                }
            }

            // add api middleware at the begining of each router
            if(_router.options) _router.handlers.unshift(middleware.api(_router.options))
        }

        // register routers
        routers.register(router, _routers)
        docs.set(pack_key, _routers)
    }

    // CONSOLE LOG SERVER INFO
    console.log(`------------------API SERVER INFO---------------------`)
    console.log(`SERVER :  https://${certbot.env.CERTBOT_DOMAIN}/api`)
    console.log(`------------------------------------------------------`)

    return {
        docs,
        router
    }
}