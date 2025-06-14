import { tsapp, certbot } from "@ts.app/core/configs/env.js"
import { ApolloServer } from '@apollo/server'
import type { WithRequired } from '@apollo/utils.withrequired';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ExpressMiddlewareOptions, expressMiddleware } from '@as-integrations/express5';

import depthLimit from 'graphql-depth-limit'
import cors from 'cors'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import mongoose from "mongoose"
import { TSAppGraphqlPlugin, IGraphqlRouter, GraphqlContext } from '@ts.app/core/common/service.js'
import { getGraphqlModules, getGraphqlRouterConfigs } from '@ts.app/core/common/cli/util.js'
import type { AccessRequest } from '@ts.app/core/models/user/access/middleware.js'
import express, { Router } from "express"
import { TypeStack, GraphqlServerOutput } from "@ts.app/core"
import http from "http"

export async function graphqlLoader(server: http.Server) {
    const { applyMiddlewareToGraphqlModule, validateUserToken } = await import('@ts.app/core/models/user/access/middleware.js')
    const router: Router = express.Router()
    const docs: IGraphqlRouter[] = []

    function getTSAppGraphqlPlugin(options: GraphqlServerOutput): TSAppGraphqlPlugin {
        return {
            async requestDidStart(req) {
                return {
                    async didResolveOperation(ctx) {
                        if (options.isPublic == false) {
                            // one request can access multiple resources
                            // for all resource requests generate a unique request id
                            // this request id will be used when logging resource access
                            ctx.contextValue.req.id = new mongoose.Types.ObjectId()
    
                            // must have valid user key, otherwise throw error
                            const {user, token} = await validateUserToken(ctx.contextValue.req)
    
                            // user role must have access to graphql service
                            await user.haveAccessToGraphqlService(options)
                        }
                    }
                }
            }
        }
    }

    for (const graphql_server of await getGraphqlRouterConfigs(TypeStack.config)) {
        // skip if isServer == false
        if(graphql_server.isServer == false) continue
        
        const {schema, resolvers, routers} = await getGraphqlModules(graphql_server, {schema: true, resolvers: true})

        // skip if schema is empty
        if(!schema || schema == "" || schema.length == 0) {
            console.log(`skipping, empty schema for pack:${graphql_server.pack} name:${graphql_server.name}`)
            continue
        }

        docs.push(...routers)

        const gql_resolvers = applyMiddlewareToGraphqlModule(resolvers)
        const gql_schema = makeExecutableSchema({ typeDefs: schema, resolvers: gql_resolvers })
        const gql_server = new WebSocketServer({ server, path: graphql_server.serverPath })
        const gql_clenup = useServer({ schema: gql_schema }, gql_server)

        const _server: ApolloServer<GraphqlContext> = new ApolloServer({
            schema: gql_schema,
            introspection: true,
            validationRules: [ depthLimit(7) ],
            plugins:[ 
                ApolloServerPluginDrainHttpServer({ httpServer: server }), {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await gql_clenup.dispose();
                            },
                        };
                    },
                },
                getTSAppGraphqlPlugin(graphql_server)
            ]
        })

        await _server.start()

        const express_middleware_options: WithRequired<ExpressMiddlewareOptions<GraphqlContext>, 'context'> = {
            context: async ({req, res}) => {
                return {
                    req: req as AccessRequest,
                    res
                }
            }
        }

        router.use(
            `${graphql_server.serverPath}`,
            cors<cors.CorsRequest>(),
            express.json({limit: "100mb"}),
            expressMiddleware<GraphqlContext>(_server, express_middleware_options)
        )

        console.log(`---GRAPHQL ${graphql_server.pack} ${graphql_server.name} SERVER INFO-------`)
        console.log(`SERVER:  https://${certbot.env.CERTBOT_DOMAIN}${graphql_server.serverPath}`)
        console.log(`------------------------------------------------------`)
    }

    return {
        docs,
        router
    }
}