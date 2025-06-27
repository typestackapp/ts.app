import * as jose from 'jose'
import mongoose from "mongoose"
import cookie from 'cookie'
import moment from 'moment'
import { AccessTokenJWTPayload, AccessTokenPayloadVerified, BearerKeyOptions, addTimeDuration, compareApiKey, getToken } from "@ts.app/core/models/user/util.js"
import { decodeApiKey } from "@ts.app/core/models/user/util.js"
import { ApiKeyTokenOutput } from "@ts.app/core/models/user/token/apikey.js"
import { UserDocument, UserModel } from '@ts.app/core/models/user.js'
import { IAccessInput, ITokenType, IExpressMethod, IGraphqlMethod, IServerAccess, IAccessOptions } from '@ts.app/core'
import { ParamsDictionary, Query } from "express-serve-static-core"
import { Request, Response, NextFunction } from "express"
import { IGraphqlRouter, IExpressRouter, ExpressResponse, ExpressErrorResponse, GraphqlResovlerModule, GraphqlResovlerMethod, GraphqlContext } from '@ts.app/core/common/service.js'
import { tsapp, certbot } from "@ts.app/core/configs/env.js"
import { ApiKeyTokenModel } from '@ts.app/core/models/user/token/apikey.js'
import { AccessTokenJWKData, JWKCache } from "@ts.app/core/models/config/jwk.js"
import { access_token_config_id } from "@ts.app/core/updates/main.js"
import { UserAccessInput, UserAccessLogDocument, UserAccessLogInput, UserAccessLogModel, UserAccessModel, UserDevice } from '@ts.app/core/models/user/access.js'
import { AccessValidator, secretCompare } from '@ts.app/core/models/user/access/util.js'
import { OauthAppModel } from '@ts.app/core/models/user/app/oauth.js'
import { TypeStack, TypeStackPackage } from '@ts.app/core/common/cli/typestack.js'

export type { Request, Response, NextFunction }
export type AccessInput = IAccessInput
export type AccessOptions = IAccessOptions

// request authorization data
interface AccessRequestData {
    id: mongoose.Types.ObjectId // request id
    middleware: MiddlewareResult
    log?: UserAccessLogDocument
    user?: UserDocument // user document is set if authorize middleware is used
    token?: AccessRequestToken // token is set if authorize middleware is used
    captcha?: CaptchaResponse // captcha is set if captcha middleware is used
}

export type AccessRequest<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query> = Request<P, ResBody, ReqBody, ReqQuery> & AccessRequestData
export type ExpressResources = { [key in IExpressMethod]?: IAccessOptions }
export type ExpressRequestHandler<Req extends AccessRequest = AccessRequest, Res extends Response = Response, Return extends Promise<any> | any = Promise<any> | any>
= (req: Req, res: Res, next: NextFunction) => Return | ((req: Req, res: Res) => Return)

export interface GraphqlServerAccess extends IServerAccess {
    serverMethod:  IGraphqlMethod
    serverType: "GRAPHQL"
    resolverName: string
}

export interface ExpressServerAccess extends IServerAccess {
    path: string[]
    serverMethod: IExpressMethod
    serverType: "EXPRESS"
}

export type ServerAccess =  GraphqlServerAccess | ExpressServerAccess

type MiddlewareResult = {
    error?: ExpressErrorResponse
    success: boolean
    req_log?: UserAccessLogDocument
}

interface UserTokenOutput {
    _id: string
    user_id: string
    client_id?: string
}

type ValidToken<Token extends UserTokenOutput | undefined, Type extends ITokenType = ITokenType> = {
    token: Token
    token_type: Type
}

type RequestToken<Token extends UserTokenOutput | undefined, Type extends ITokenType = ITokenType> = Token & {
    token_type: Type
}

export type BearerTokenOutput = UserTokenOutput & AccessTokenJWTPayload & {
    client_id: string
}

type AccessRequestToken = 
RequestToken<UserTokenOutput & { access: ApiKeyTokenOutput["data"]["access"] }, "ApiKey">
| RequestToken<BearerTokenOutput, "Bearer">
| RequestToken<BearerTokenOutput, "Cookie">
| { _id: undefined, token_type: "Basic" }

export type ValidUserToken = 
| ValidToken<ApiKeyTokenOutput, "ApiKey"> & { user: UserDocument }
| ValidToken<BearerTokenOutput, "Bearer"> & { user: UserDocument }
| ValidToken<BearerTokenOutput, "Cookie"> & { user: UserDocument }
| ValidToken<undefined, "Basic"> & { user: UserDocument }

export type CaptchaOptions = {
    enabled: boolean
    type: string
    domains: string[]
    site_key: string
    secret_key: string
}

export type CaptchaResponse = {
    success: boolean,       // whether this request was a valid reCAPTCHA token for your site
    score: number,          // the score for this request (0.0 - 1.0)
    enabled: boolean,       // whether the user has disabled captcha
    action: string,         // the action name for this request (important to verify)
    challenge_ts: string,   // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    hostname: string,       // the hostname of the site where the reCAPTCHA was solved
    'error-codes': string[] // optional
}

export const upsertRouterDocs = async function (routers: IExpressRouter[] | IGraphqlRouter[]) {
    const _promsises: Promise<any>[] = []
   
    for(const _router of routers) {
        const pkey = _router?.options?.pack || ''
        const pack = TypeStack.findPackage(pkey)
        if(!pack) {
            console.log(`Warning, package not found ${pkey}`)
            continue
        }

        const access_input: UserAccessInput = {
            pack: pack.pack.json.name,
            version: pack.pack.json.version,
            server: _router.server,
            access: _router.options ? _router.options : undefined
        }
        
        const query = UserAccessModel.findOneAndUpdate(
            {
                version: access_input.version,
                "server.path": access_input.server.path,
                "server.serverMethod": access_input.server.serverMethod,
                "server.serverType": access_input.server.serverType
            },
            access_input,
            { upsert: true, new: false }
        )
        
        _promsises.push(query.exec())
    }

    const res = await Promise.all(_promsises)
    return res
}

export const applyMiddlewareToGraphqlModule = function (module: GraphqlResovlerModule) {
    const resolvers: GraphqlResovlerMethod = {}

    for(const [k1, v1] of Object.entries(module)) {
        if(!v1) continue
        for(const [k2, v2] of Object.entries(v1)) {
            if(!v2) continue
            
            const resolver_name_l1 = k1 as string
            const resolver_name_l2 = k2 as string
            const resolver = v2
            var resolver_method = resolver.resolve
            const resovler_access = resolver.access
            
            if( resolver_method == undefined 
                || resolver_method == null 
                || typeof resolver_method !== 'function'
            ) continue

            if(resovler_access) {
                resolver_method = async (parent: any, args: any, context: GraphqlContext, info: any) => {
                    const result = await middleware.graphql(context, resovler_access)
                    const resolver_result = await resolver.resolve(parent, args, {...context, log: result.req_log, middleware:result }, info)
                    if(resolver_result instanceof Error) throw resolver_result
                    return resolver_result
                }
            }
            
            resolvers[resolver_name_l1] = {
                ...resolvers[resolver_name_l1],
                [resolver_name_l2]: resolver_method
            }
        }
    }
    return resolvers
}

export const middleware = {
    api: (options: IAccessOptions, catchResult: boolean = false): ExpressRequestHandler => {
        return async (req, res, next) => {
            const result = await middlewares(req, options)
            req.middleware = result
            req.log = result.req_log
            res.once('finish', () => result.req_log?.save())
            if(!catchResult && !result.success) {
                const response: ExpressResponse = {
                    error: result.error,
                    data: undefined
                }
                res.send(response)
            }else {
                next()
            }
        }
    },
    graphql: async (context: GraphqlContext, options: IAccessOptions, catchResult: boolean = false) => {
        const result = await middlewares(context.req, options)
        context.res.once('finish', () => result.req_log?.save())
        if(!catchResult && !result.success) throw result.error?.msg
        return result
    }
}

export async function middlewares( req: AccessRequest, options: IAccessOptions ): Promise<MiddlewareResult> {
    let error = "unknown-error"
    let req_log: UserAccessLogDocument | undefined

    try {
        error = "invalid-req-id"
        req.id = req.id || new mongoose.Types.ObjectId()

        error = "invalid-log"
        req_log = await log(req, options)

        error = "access-disabled"
        await disabled(req, options)

        error = "invalid-limit"
        if(options.limit?.enabled == true) throw `Limit, limit is not supported yet`

        error = "invalid-auth"
        await auth(req, options, req_log)

        error = "invalid-captcha"
        await captcha(req, options)

        await req_log?.addInfo(`middleware-ok`)
        return  { req_log, success: true }
    } catch (err) {
        console.error(`Error in middleware for ${getResourceInfo(options)}: ${err}`)
        await req_log?.addInfo(error, `${err}`)
        return  { req_log, success: false, error: { code: error, msg: `${err}` } }
    }
}

export function getResourceInfo( options: IAccessOptions | undefined ): string {
    if(!options) return ''
    return `${options.resource}.${options.action}.`
}

async function log( req: AccessRequest, options: IAccessOptions ) {
    if(options.log?.enabled == false) return

    const ipJoin = (...ip: (string[] | string | undefined)[]): string | undefined => {
        for(const i of ip) {
            if(i && i != '::1' && i != 'undefined') {
                // replace all "::ffff:"
                return i.toString().replace(/^.*:/, '')
            }
        }
    }
    
    const device: UserDevice = {
        ip_address: ipJoin(req.headers['x-forwarded-for'], req.ip),
        agent: req.headers['user-agent']
    }

    const pack = TypeStack.findPackage(options.pack)
    if(!pack) console.log(`Warning, package not found ${options.pack}`)

    // resolve user_access id
    const user_access = await UserAccessModel.findOne({
        'version': pack?.pack.json.version,
        'pack': options.pack,
        'access.resource': options.resource,
        'access.action': options.action
    })
    
    const log_input: UserAccessLogInput = {
        req_id: req.id,
        device,
        access: (user_access) ? undefined : options,
        access_id: user_access?._id
    }

    return new UserAccessLogModel(log_input)
}

async function disabled( req: AccessRequest, options: IAccessOptions ): Promise<void> {
    if(options.enabled == false)
        throw `Access to resource ${getResourceInfo(options)} is disabled`
}

export async function auth( req: AccessRequest, options: IAccessOptions, log?: UserAccessLogDocument ): Promise<void> {
    // show warning if user set auth.enabled to false
    if(options.auth?.enabled === false) {
        console.log(`WARNING, authentification disabled for ${getResourceInfo(options)}`)
        if(req.log) await req.log.addInfo(`auth-disabled`)
        return
    }

    // authentification by default is disabled
    if(options.auth?.enabled === undefined) return

    var user = req.user
    var token = req.token

    if(!user || !token) {
        var valid_token = await validateUserToken(req, options)
        req.user = user = valid_token.user
        if (valid_token.token_type === "ApiKey") {
            req.token = token = {
                token_type: valid_token.token_type,
                _id: valid_token.token._id,
                user_id: valid_token.token.user_id,
                access: valid_token.token.data.access,
            } 
        }else if (valid_token.token_type === "Bearer" || valid_token.token_type === "Cookie") {
            req.token = token = {
                token_type: valid_token.token_type,
                _id: valid_token.token._id,
                client_id: valid_token.token.client_id,
                user_id: valid_token.token.user_id,
                issuer: valid_token.token.issuer,
            }
        }else if (valid_token.token_type === "Basic") {
            req.token = token = {
                token_type: valid_token.token_type,
                _id: undefined,
            }
        }
    }

    if(!token) 
        throw `Auth, token not found`

    if(log) {
        log.user = {
            id: user._id,
            token_id: token._id,
            token_type: token.token_type
        }
    }

    // user key should have access to resource
    if(token?.token_type == "ApiKey") {
        const validator = new AccessValidator(token.access)
        if(!validator.checkAccess(options))
            throw `Auth, user apikey has insuficient permission access to resource: ${getResourceInfo(options)}`
    }else if(token?.token_type === "Bearer" || token?.token_type === "Cookie") {
        const app = await OauthAppModel.findOne({ "data.client_id": token.client_id })
        if(!app)
            throw `Auth, Bearer app:${token.client_id} not found`
        const validator = new AccessValidator(app.data.access)
        if(!validator.checkAccess(options))
            throw `Auth, user app: ${token.client_id} has insuficient permission access to resource: ${getResourceInfo(options)}`
    
    }else if(token?.token_type === "Basic") {
        // do nothing
    }else {
        throw `Auth, undefined auth key`
    }
}

// middleware for validating captcha request
async function captcha(req: AccessRequest, options: IAccessOptions): Promise<CaptchaResponse> {
    return new Promise<CaptchaResponse>((resolve, reject) => {
        req.captcha = {
            success: false,
            enabled: false,
            score: 0,
            action: '',
            challenge_ts: '',
            hostname: '',
            'error-codes': [`Captcha, is disabled for resource ${getResourceInfo(options)}`]
        }

        resolve(req.captcha)

        // TODO move captcha 
        // if(options?.captcha == undefined || options.captcha.enabled == false) return resolve(req.captcha)
        // const type = options.captcha.type
        // const pack = options.captcha.pack
        // const token = req.headers['x-captcha-token']
        // const captcha_options = tscore.config[pack].captcha
        // const captcha_config = Object.values<CaptchaOptions>(captcha_options).find((c) => c.type == type)

        // if(captcha_config == undefined) throw `Captcha, is undefined, please define captcha config for resource ${getResourceInfo(options)}`

        // const is_enabled = captcha_config.enabled as boolean
        // if( is_enabled == false ) return resolve(req.captcha)
        
        // if(!token || typeof token !== 'string') throw "Captcha, token x-captcha-token was not found in request headers"

        // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${captcha_config.secret_key}&response=${token}`
        // fetch(url, {
        //     method: 'POST',
        // })
        // .then(res => res.json())
        // .then(async json => {
        //     json = {...json, enabled: true } as CaptchaResponse

        //     if(req.log) {
        //         req.log.captcha = json
        //         await req.log.save()
        //     }

        //     if( json.success ) {
        //         req.captcha = json
        //         resolve(json)
        //     } else {
        //         reject(`Error, Captcha, ${json['error-codes']}`)
        //     }
        // })
        // .catch(err => {
        //     reject(err)
        // })
    })
}

// Validates user provided token
export async function validateUserToken( req: Request, options?: IAccessOptions): Promise<ValidUserToken> {
    var authParamKeyName: string | undefined = undefined

    if(options?.auth?.authParamKeyName) {
        authParamKeyName = req.params[options.auth?.authParamKeyName]
    }

    const auth_header = req?.headers?.authorization || authParamKeyName
    let auth_type: ITokenType | undefined = undefined
    let auth_token: string | undefined = undefined

    if(auth_header) {
        // try using auth header 
        let auth: string[] = []
        for (const delimiter of [" ", "%20"]) {
            auth = auth_header.split(delimiter)
            if (auth.length === 2) break
        }
        if( auth.length != 2 ) throw `Auth, Invalid authorization delemetre`
        auth_token = auth[1]
        auth_type = auth[0] as ITokenType
    }else {
        // try using cookie if auth header is not set
        const cookies = cookie.parse(req.headers.cookie || '')
        let cookie_token: string | undefined = undefined
        let app_id: string | undefined = undefined
        let is_at: boolean | undefined = undefined

        for(const [cookie_name, cookie_value] of Object.entries(cookies)) {
            app_id = cookie_name.split('_')[0]
            is_at = cookie_name.split('_')[1] == 'at'
            if(app_id && is_at) {
                cookie_token = cookie_value
                break
            }
        }

        if(cookie_token) {
            auth_type = "Cookie"
            auth_token = cookie_token
        }
    }

    if(auth_type == undefined) throw `Auth, auth type not found`
    if(auth_token == undefined) throw `Auth, auth token not found`
    
    if(options) {
        if(!options?.auth?.tokens)
            throw `Auth, authTypes is undefined for resource: ${getResourceInfo(options)}`

        // check auth type for resource if set
        if(!options.auth?.tokens.includes(auth_type))
            throw `Auth, type: ${auth_type} not allowed for resource: ${getResourceInfo(options)}`
    }

    let valid_user_key: ValidUserToken
    
    // check auth key validity
    switch (auth_type) {
        case "Basic":
            valid_user_key = await validateBasicKey(auth_token)
        break
        case "ApiKey":
            valid_user_key = await validateApiKey(auth_token)
        break
        case "Bearer":
            valid_user_key = await validateBearerKey(auth_token, {}, "Bearer")
        break
        case "Cookie":
            valid_user_key = await validateBearerKey(auth_token, {}, "Cookie")
        break
        default:
            console.log(`
                WARNING, Auth, type ${auth_type} can't be used by authorizadion middleware, 
                if you wish to disable auth validation set isAuthorizationEnabled: true for: 
                resource: ${options?.resource}
                path: ${getResourceInfo(options)}'
                req.url: ${req.url}
                req.method: ${req.method}
            `)
            throw `Auth, type ${auth_type} not valid auth type, for more info see logs`
    }

    req.user = valid_user_key.user
    return valid_user_key
}

export const validateBasicKey = async ( base64: string ): Promise<ValidUserToken> => {
    const [usn, psw] = Buffer.from(base64, 'base64').toString().split(':')
    const user = await UserModel.findOne({ usn })
    if(!user) throw "user not found"
    const match = secretCompare(psw, user.psw)
    if(!match) throw "invalid password"
    return { user, token: undefined, token_type: "Basic" }
}

export const validateApiKey = async ( key: string ): Promise<ValidUserToken> => {
    const { _id, secret } = decodeApiKey(key)
    const token = await ApiKeyTokenModel.findOne({_id})
    if(!token) throw "api key not found"
    if(!compareApiKey(secret, token)) throw "invalid api key"
    const user = await UserModel.findOne({ _id:token.user_id })
    if(!user) throw "user not found"
    return { user, token: token.toJSON() as any, token_type: "ApiKey" }
}

export const validateBearerKey = async ( key: string, options: BearerKeyOptions = {}, token_type: "Bearer" | "Cookie" ): Promise<ValidUserToken> => {
    const [token_id, access_token] = getToken(key)
    const access_jwk = await JWKCache.get<AccessTokenJWKData>(access_token_config_id)
    const issuer = certbot.env.CERTBOT_DOMAIN
    const access_token_key = await jose.importJWK(access_jwk.key)
    const verified_access_token = await jose.jwtVerify(access_token, access_token_key, { issuer }) as AccessTokenPayloadVerified
    const extendedTime = options.accessTokenExtendTime || access_jwk.data.extendTime

    if(!verified_access_token.payload.iat) throw "Access token iat not set"
    const issuedAt = moment.unix(verified_access_token.payload.iat)
    if(addTimeDuration(issuedAt, extendedTime).unix() < moment.utc().unix()) throw "Access token expired"
    
    const user = await UserModel.findOne({ _id: verified_access_token.payload.user_id })
    if(!user) throw "user not found"
    return { user, token: {...verified_access_token.payload, _id: token_id}, token_type: token_type }
}