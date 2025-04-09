/* 
    Do not import models is this file!
    This file is used outside global DB connections.
    Importing models will cause error.
*/

import fs from "fs-extra"
import _ from 'lodash'
import { Response } from "express"
import { ParamsDictionary, Query } from "express-serve-static-core"
import type { ChangeStream, ChangeStreamDocument } from "mongodb"
import type { Document } from "bson"
import type { IAccessOptions, IMongoOperationType, IExpressMethod } from "@ts.app/core"
import type { ApolloServerPlugin } from '@apollo/server'
import type { AccessRequest, GraphqlServerAccess, ExpressRequestHandler, ExpressServerAccess} from "@ts.app/core/models/user/access/middleware.js"
import type { Router } from "express"
import { IGraphqlMethod } from "@ts.app/core"
import { DeepRequired } from "utility-types"
import { Resolver } from "@apollo/client"
import { getGraphqlResolverKeys } from "@ts.app/core/common/cli/util.js"
import { GraphqlServerOutput, TypeStack } from "@ts.app/core/common/cli/typestack.js"
import {  } from "@ts.app/core/common/cli/typedefs.js"

export type ExpressErrorResponse = {
    code: string
    msg: string
}

export type ExpressResponse<Data = any, Error = ExpressErrorResponse> = {
    data?: Data
    error?: Error
}

export interface IExpressRouter {
    options?: IAccessOptions
    server: ExpressServerAccess
    handlers: ExpressRequestHandler[]
}

export type ExpressHandler<ReqParams = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query> = {
    body?: ReqBody
    params?: ReqParams
    query?: ReqQuery
    res?: ResBody
}
export type ExpressHandlers = {
    get?: ExpressHandler
    post?: ExpressHandler
    use?: ExpressHandler
}

export type ExpressResolver<Req extends AccessRequest = AccessRequest, Res extends Response = Response> = ExpressRequestHandler<Req, Res> | ExpressRequestHandler<Req, Res>[]
export type ExpressRoute<ReqParams extends ParamsDictionary = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery extends Query = Query> = {
    path?: string
    access: IAccessOptions
    resolve: ExpressResolver<AccessRequest<ReqParams, ResBody, ReqBody, ReqQuery>, Response<ResBody>>
}

type EHK = keyof ExpressHandlers
type RouteParams<K extends EHK, T extends ExpressHandlers> = T[K] extends ExpressHandler ? NonNullable<NonNullable<T[K]>["params"]> : ParamsDictionary;
type RouteResBody<K extends EHK, T extends ExpressHandlers> = T[K] extends ExpressHandler ? NonNullable<NonNullable<T[K]>["res"]>: any;
type RouteReqBody<K extends EHK, T extends ExpressHandlers> = T[K] extends ExpressHandler ? NonNullable<NonNullable<T[K]>["body"]>: any;
type RouteReqQuery<K extends EHK, T extends ExpressHandlers> = T[K] extends ExpressHandler ? NonNullable<NonNullable<T[K]>["query"]> : Query;
type ExpressRouteType<K extends EHK, T extends ExpressHandlers> = ExpressRoute<RouteParams<K, T>, RouteResBody<K, T>, RouteReqBody<K, T>, RouteReqQuery<K, T>>

export class ExpressRouter<T extends ExpressHandlers = ExpressHandlers> {
    private static prefix: string = "/api" // Express router prefix /${prefix}/...
    private static default_path: string  = "/" // default path is used when no path is provided when adding a route
    private static pack: string
    private routes: {[key in keyof T]?: ExpressRoute} = {}

    set get(route: ExpressRouteType<"get", T>) {
        this.routes.get = route
    }

    set post(route: ExpressRouteType<"post", T>) {
        this.routes.post = route
    }

    set use(route: ExpressRouteType<"use", T>) {
        this.routes.use = route
    }

    getOptions(
            method: IExpressMethod,
            path?: string | IAccessOptions | ExpressRequestHandler,
            options?: IAccessOptions | ExpressRequestHandler
        ): {
            options?: IAccessOptions,
            server: ExpressServerAccess
        }{

        let _options: IAccessOptions | undefined = undefined

        if(typeof path === 'object') {
            _options = path
        } else if(typeof options === 'object') {
            _options = options
        }

        return {
            options: _options,
            server: {
                path: this.getPath(path),
                serverMethod: method,
                serverType: "EXPRESS"
            }
        }
    }

    private getPath(path?: string | IAccessOptions | ExpressRequestHandler): string[] {
        let _paths: string[] = []

        // any user provided path /${prefix}/${path}
        if(typeof path === 'string') 
            _paths.push(path)

        // default path /${prefix}/${pack}/${file_structure}/${file_name}
        _paths.push(`${ExpressRouter.prefix}/${ExpressRouter.pack}${ExpressRouter.default_path}/`)

        // alias path /${prefix}/${alias}/${file_structure}/${file_name}
        const pack = TypeStack.findPackage(ExpressRouter.pack)
        const alias = pack?.alias
        
        if(alias)
            _paths.push(`${ExpressRouter.prefix}/${alias}${ExpressRouter.default_path}/`)

        if(alias == null)
            _paths.push(`${ExpressRouter.prefix}${ExpressRouter.default_path}/`)

        // console.log(`Loading api route: ${ExpressRouter.pack}${ExpressRouter.default_path}`)
        // console.log(_paths)

        return _paths
    }

    getRouters(): IExpressRouter[] {
        const routers: IExpressRouter[] = []
        for(const [serverMethod, route] of Object.entries<ExpressRoute | undefined>(this.routes)) {
            if(!route) continue
            routers.push({
                ...this.getOptions(serverMethod as IExpressMethod, route.path, route.access),
                handlers: (route.resolve instanceof Array) ? route.resolve : [route.resolve]
            })
        }
        return routers
    }

    static getPaths(paths: string[]): string[] {
        return paths.map(path => {
            let _path = path
            // replace [] with :
            // _path = 
    
            // replace _ with /
            _path = _path.replace(/_/g, (match, offset, string) => {
                // console.log(_path, match, offset, string)
    
                // if next char is : then replace with /
                if (string[offset + 1] == '[' ||string[offset + 1] == ':') return '/'
    
                // check if _ is part of param
                // crawl backwards till find : or / or offset is 0
                    // if : then replace with nothing
                    // if / or offset 0 then replace with /
                let i = offset - 1
                while(i >= 0) {
                    if (string[i] == ']') return "/"
                    if (string[i] == '[' || string[i] == ':') return match
                    if (string[i] == '/') return '/'
                    if (i == 0) return '/'
                    i--
                }
                
                return match
            })
            return _path.replace(/\[(.*?)\]/g, ":$1")
        });
    }

    register(router: Router, routers: IExpressRouter[]) {
        routers.forEach(_router => {
            console.log(`Registering ${_router.server.serverMethod} ${ExpressRouter.getPaths(_router.server.path)}`)
            router[_router.server.serverMethod](ExpressRouter.getPaths(_router.server.path), ..._router.handlers as unknown as any[])
        })
    }

    static setDefaultPath(options: {default_api_route: string, pack: string, prefix: string}) {
        this.default_path = options.default_api_route
        this.pack = options.pack
        this.prefix = options.prefix
    }

    // Imports API routers
    async loadExpressRoutes(_root: string, _pack: string, _prefix: string) {
        const routers: IExpressRouter[] = []

        const loadRouter = async (full_path: string, _path: string) => {
            try {
                // skip map js files
                if(_path.endsWith(".js.map")) return

                const default_api_route = full_path.replace(_root, "")
                ExpressRouter.setDefaultPath({
                    default_api_route,
                    pack: _pack,
                    prefix: _prefix
                })

                const module = await import(full_path)

                if(module?.router) {
                    const _router = module.router as ExpressRouter
                    routers.push(..._router.getRouters())
                }

                ExpressRouter.setDefaultPath({
                    default_api_route: "",
                    pack: "" as any,
                    prefix: ""
                })
            } catch (error) {
                console.error(`Error, Api route cant be loaded in: ${full_path}`)
                console.error(error)
            }
        }
        
        const loadRouters = async (root_path: string) => {
            const _paths = fs.readdirSync(root_path)
            for await(const _path of _paths) {
                const full_path = `${root_path}/${_path}`

                if(fs.lstatSync(full_path).isDirectory()) {
                    await loadRouters(full_path)
                }else{
                    await loadRouter(full_path, _path)
                }
            }
        }

        const _paths = fs.readdirSync(_root)
        for await(const _path of _paths) {
            const full_path = `${_root}/${_path}`
            if(fs.lstatSync(full_path).isDirectory()){
                await loadRouters(full_path)
            }else{
                await loadRouter(full_path, _path)
            }
        }

        return routers
    }
}

export interface IGraphqlRouter {
    options?: IAccessOptions
    server:  GraphqlServerAccess
    serverConfig: GraphqlServerOutput
}

type GraphqlResolverInput<TResolvers> = {
    [Key in keyof TResolvers]?: {
        [Key2 in keyof TResolvers[Key]]?: TResolvers[Key][Key2]
    }
}

type GraphqlResolver<Resolve = any> = {
    typedef?: string,
    access?: IAccessOptions,
    resolve: Resolve 
}

type GraphqlResolvers<TResolvers> = {
    [Key in keyof DeepRequired<TResolvers>]: Key extends keyof Required<TResolvers> ? {
        [Key2 in keyof Required<TResolvers>[Key]]?: GraphqlResolver<Required<TResolvers>[Key][Key2]>
    } : never
}

export type GraphqlResovlerModule = {[key:string]: {[key:string]: GraphqlResolver<Resolver>}}
export type GraphqlResovlerMethod = {[key:string]: {[key:string]: Resolver}}

export class GraphqlRouter<TResolvers extends GraphqlResolverInput<TResolvers>> {
    resolvers: GraphqlResolvers<TResolvers>

    constructor() {
        const resolvers: {[key: string]: {[key: string]: {}}} = {}
        getGraphqlResolverKeys().map(resolver => resolvers[resolver] = {})
        this.resolvers = resolvers as GraphqlResolvers<TResolvers>
    }

    getResolvers() {
        const resolvers: GraphqlResovlerModule = this.resolvers as any
        return resolvers
    }

    getRouters(serverConfig: GraphqlServerOutput) {
        const routers: IGraphqlRouter[] = []
        let options = undefined
        for(const [serverMethod, resolver] of Object.entries(this.resolvers)) {
            if(!resolver) continue
            for(const [resolverName, method] of Object.entries(resolver)) {
                if(!method) continue

                routers.push({
                    serverConfig,
                    options: options,
                    server: {
                        resolverName: resolverName,
                        serverMethod: serverMethod as IGraphqlMethod,
                        path: [serverConfig.serverPath],
                        serverType: "GRAPHQL",
                    }
                })
            }
        }
        return routers
    }

    // replaces all ! with empty string
    static deepOptional(typeDef: string): string {
        return typeDef.replace(/!/g, "")
    }
}

export type GraphqlContext = {
    req: AccessRequest
    res: Response
}

export interface TSAppGraphqlPlugin extends ApolloServerPlugin<GraphqlContext> {}

// listens on mongo change stream
export class StreamListener<T extends Document = Document> {
    listener: Promise<ChangeStreamDocument<T>>

    constructor(public stream: any) {
        stream = stream as ChangeStream<T>
        this.listener = stream.next()
        this.streamListener()
    }

    async streamListener() {
        await this.listener
        this.listener = this.stream.next()
        this.streamListener()
    }

    getOperation(haystack: Array<IMongoOperationType>, needle: string): IMongoOperationType | undefined {
        return haystack.find((op) => op.toString() == needle)
    }

    yield(sub_name: string, data: ChangeStreamDocument<T>) {
        let _sub: { [key: string ]: any } = {}
        _sub[sub_name] = data
        return _sub
    }
}