import moment from 'moment'
import cookie from 'cookie'
import { Types } from 'mongoose'
import { Request, Response } from 'express'
import { z } from "zod"
import * as trpcExpress from '@trpc/server/adapters/express'
import { initTRPC, inferAsyncReturnType, inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { OauthAppModel } from "@ts.app/core/models/user/app/oauth.js"
import { BearerKeyOptions, newAccessToken, newRefreshToken } from "@ts.app/core/models/user/util.js"
import { AccessRequest, middlewares } from "@ts.app/core/models/user/access/middleware.js"
import { allowed_actions, z_app_filters } from '@ts.app/core/common/auth.js'
import { BearerTokenInput, BearerTokenInputData, BearerTokenModel } from '@ts.app/core/models/user/token/bearer.js'
import { AccessValidator } from '@ts.app/core/models/user/access/util.js'
import { CallbackOptions, ClientSession } from '@ts.app/core/models/user/app/oauth/client.js'
import { UserModel } from '@ts.app/core/models/user.js'
import { RoleConfigModel } from '@ts.app/core/models/config/role.js'
import { tsapp, certbot } from "@ts.app/core/configs/env.js"
import tscore, { ExpressErrorResponse, ExpressResponse, ExpressRouter } from "@ts.app/core"

const config = tscore.config
const t = initTRPC.context<Context>().create()
export const createContext = ({ req, res }): { req: Request, res: Response } => ({ req, res });

export type Context = inferAsyncReturnType<typeof createContext>
export type AuthRouter = typeof authRouter
export type AuthInput = inferRouterInputs<AuthRouter>;
export type AuthOutput = inferRouterOutputs<AuthRouter>;

const getCookie = (req: AccessRequest, name: string) => {
    const cookies = cookie.parse(req.headers.cookie || '')
    if(!cookies[name]) return undefined
    return cookies[name]
}

const setCookie = (res: Response, name: string, value: string, maxAge: number = 0, path: string) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: tsapp.env.TS_ENV_TYPE == "dev"? undefined: maxAge,
        path,
    })
}

const clearCookie = (res: Response, name: string) => {
    res.clearCookie(name, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
}

async function basicUserAppValidation(client_id: string, roles: string[], actions?: ["login" | "register" | "grant"]) {
    const app = await OauthAppModel.findOne({
        "actions": { $in: actions || allowed_actions },
        "data.client_id": client_id
    })

    if(!app) 
        return { code: "invalid-auth-app-not-found", msg: "app not found" }

    const role_configs = await RoleConfigModel.find({
        "data.name": { $in: roles }
    })

    const role_names = role_configs.map( role => role.data.name )
    const role_access = role_configs.map( role => role.data.resource_access )

    if(!role_configs || role_configs.length === 0)
        return { code: "invalid-auth-role-not-found", msg: "role not found" }

    if(!app.data.roles.some(role => role_names.includes(role)))
        return { code: "invalid-auth-role-not-allowed", msg: "role not allowed" }

    const validator = new AccessValidator(role_access)
    const access_check = validator.checkResourceAccess(app.data.access)
    
    if(!access_check.has_partial_access)
        return { code: "invalid-auth-access", msg: "access not found" }

    return {
        code: "ok",
        msg: "ok",
        access_check,
        app,
        role_configs
    }
}

export const tokenRouter = t.router({
    password: t.procedure
    .input(z.object({
        client_id: z.string()
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const client_id = opts.input.client_id

        let response: ClientSession = {
            data: undefined,
            error: undefined
        }

        try {
            const {success, error} = await middlewares(req, config.access.Auth.tokenPassword)
            if(!success && error) {
                response.error = error
                return response
            }

            if(!req.user) {
                response.error = { code: "invalid-auth-user-not-found", msg: "user not found" }
                return response
            }

            const is_valid = await basicUserAppValidation(client_id, req.user.roles)
            if(is_valid.code != "ok") {
                response.error = is_valid
                return response
            }

            const token = await newRefreshToken(req.user, client_id, "password", {})
            const token_expires_at = ( moment(token.key.refresh.exp).unix() - moment.utc().unix() ) * 1000 * 3 

            setCookie(res, `${client_id}_rt`, token.key.refresh.tk, token_expires_at, req.baseUrl)
            setCookie(res, `${client_id}_at`, token.key.access.tk, token_expires_at, "/")
            
            if(req.log) {
                req.log.user = {
                    id: new Types.ObjectId(token.payload.user_id),
                    token_type: "Bearer"
                }
                await req.log.save()
            }

            response.data = {
                ...token.key,
                refresh: undefined // remove refresh token from response
            }
            return response
        } catch (error) {
            response.error = { code: "invalid-auth", msg: `${error}` }
            return response
        }
    }),
    session: t.procedure
    .input(z.object({
        client_id: z.string()
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const client_id = opts.input.client_id

        let response: ClientSession = {
            data: undefined,
            error: undefined
        }

        try {
            let response: ClientSession = {
                data: undefined,
                error: undefined
            }
    
            const {success, error} = await middlewares(req, config.access.Auth.tokenSession)
            if(!success && error) {
                response.error = error
                return response
            }
    
            const refresh_token = getCookie(req, `${client_id}_rt`)
            const access_token = getCookie(req, `${client_id}_at`)
            const token_options: BearerKeyOptions = {}
    
            if(!refresh_token || !access_token) {
                response.error = { code: "invalid-auth-no-token-found", msg: "no token found" }
                return response
            }
    
            const token = await newAccessToken(refresh_token, access_token, token_options)
            const token_expires_at = ( moment(token.key.refresh.exp).unix() - moment.utc().unix() ) * 1000 * 3 
    
            setCookie(res, `${client_id}_rt`, token.key.refresh.tk, token_expires_at, req.baseUrl)
            setCookie(res, `${client_id}_at`, token.key.access.tk, token_expires_at, "/")
    
            response.data = {
                ...token.key,
                refresh: undefined
            }
            return response
        } catch (error) {
            response.error = { code: "invalid-auth", msg: `${error}` }
            return response
        }

    }),
    authorization_code: t.procedure
    .input(z.object({
        client_id: z.string(),
        code: z.string(),
        client_secret: z.string()
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const client_id = opts.input.client_id
        const code = opts.input.code
        const client_secret = opts.input.client_secret

        let response: ClientSession = {
            data: undefined,
            error: undefined
        }

        try {
            const {success, error} = await middlewares(req, config.access.Auth.tokenAuthorizationCode)

            if(!success && error) {
                response.error = error
                return response
            }

            const app = await OauthAppModel.findOne({
                "actions": { $in: allowed_actions },
                "data.client_id": client_id,
                "data.client_secret": client_secret,
            })

            if(!app) {
                response.error = { code: "invalid-auth-app-not-found", msg: "app not found" }
                return response
            }

            const token_doc = await BearerTokenModel.findOne({
                _id: code,
                app_id: app._id,
                status: "initilized"
            })

            if(!token_doc) {
                response.error = { code: "invalid-auth-token", msg: "token not found" }
                return response
            }

            const user = await UserModel.findOne({
                _id: token_doc.user_id
            })

            if(!user) {
                response.error = { code: "invalid-auth-user-not-found", msg: "user not found" }
                return response
            }

            const token = await newRefreshToken(user, client_id, "authorization_code", {})
            response.data = token.key
            return response
        } catch (error) {
            response.error = { code: "invalid-auth", msg: `${error}` }
            return response
        }
    }),
    refresh_token: t.procedure
    .input(z.object({
        refresh_token: z.string(),
        client_id: z.string(),
        client_secret: z.string()
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const client_id = opts.input.client_id
        const refresh_token = opts.input.refresh_token
        const client_secret = opts.input.client_secret

        let response: ClientSession = {
            data: undefined,
            error: undefined
        }

        try {
            const {success, error} = await middlewares(req, config.access.Auth.tokenRefreshToken)
        
            if(!success && error) {
                response.error = error
                return response
            }
        
            if(!req.user) {
                response.error = { code: "invalid-auth-user-not-found", msg: "user not found" }
                return response
            }
        
            const app = await OauthAppModel.findOne({
                "actions": { $in: allowed_actions },
                "data.client_id": client_id,
                "data.client_secret": client_secret,
            })
            if(!app) {
                response.error = { code: "invalid-auth-app-not-found", msg: "app not found" }
                return response
            }
        
            const token_doc = await BearerTokenModel.findOne({
                _id: refresh_token,
                app_id: app._id,
                user_id: req.user?._id,
            })
        
            if(!token_doc || token_doc.status != "active") {
                response.error = { code: "invalid-auth-token", msg: " token not found" }
                return response
            }
        
            if(!token_doc.data) throw new Error("No token data found")
        
            const token_options: BearerKeyOptions = {}
        
            if(!token_doc.data.token.refresh) throw new Error("No refresh token found")
        
            const token = await newAccessToken(token_doc.data.token.refresh.tk, token_doc.data.token.access.tk, token_options)
            token_doc.status = "active"
            token_doc.data.token.refresh = token.key.refresh
            token_doc.data.token.access = token.key.access
            await token_doc.save()
            response.data = token.key
            return response
        } catch (error) {
            response.error = { code: "invalid-auth", msg: `${error}` }
            return response
        }
    }),
})

export const authRouter = t.router({
    
    // get app info
    app: t.procedure
    .input(z.object({
        client_id: z.string(),
    }))
    .query(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const query: Parameters<typeof OauthAppModel["findOne"]>[0] = {
            "actions": { $in: allowed_actions },
            "data.client_id": opts.input.client_id
        }

        const {success, error} = await middlewares(req, config.access.Auth.app)
        if(!success && error) return { error, data: null }

        const app = await OauthAppModel.findOne(query)
        if(!app) {
            const error: ExpressErrorResponse = { code: "invalid-auth-app-not-found", msg: "app not found" }
            return { error, data: null }
        }

        const client = await app.getClient()
        if(!client){
            const error: ExpressErrorResponse = { code: "invalid-auth-client-not-found", msg: "client not found" }
            return { error, data: null }
        }

        return {
            error: null,
            data: {
                _id: app._id,
                client_id: app.data.client_id,
                grants: app.data.grants,
                access: app.data.access,
                actions: app.actions,
                name: app.name,
                icon: app.icon,
                description: app.description,
                callback_url: app.data.callback_url,
                redirect_url: app.data.redirect_url,
            }
        }
    }),

    // returns a list of apps that can be used
    apps: t.procedure
    .input(z_app_filters)
    .query(async (opts) => {
        const actions = opts.input.actions || allowed_actions
        const apps = await OauthAppModel.find({
            "actions": { $in: actions }
        })
        return Promise.all(apps.map(app => {
            return app.getClient().then(client => {
                return {
                    _id: app._id,
                    client_id: app.data.client_id,
                    // return only grant type as array [grant_type]
                    grants: app.data.grants.map(grant => grant.type),
                    actions: app.actions,
                    name: app.name,
                    icon: app.icon,
                    description: app.description,
                    callback_url: app.data.callback_url,
                    redirect_url: app.data.redirect_url,
                }
            })
        }))
    }),

    // retrive or create token
    token: tokenRouter,
    
    // revoke token
    revoke: t.procedure
    .input(z.object({
        token_id: z.string().optional(),
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res

        const response: ExpressResponse<boolean | undefined> = {
            data: undefined,
            error: undefined
        }

        const {success, error} = await middlewares(req, config.access.Auth.revoke)
        if(!success && error) {
            response.error = error
            return response
        }
        
        if(!req.user) {
            response.error = { code: "invalid-auth-user-not-found", msg: "user not found" }
            return response
        }

        // try revoke session token
        const token_id = req.token?._id || opts.input.token_id
        if(!token_id) {
            response.error = { code: "invalid-auth-token", msg: "token_id not found" }
            return response
        }

        const token = await BearerTokenModel.findOne({
            _id: token_id,
            user_id: req.user._id,
            status: "active"
        })
        
        if(!token) {
            response.error = { code: "invalid-auth-token", msg: "token not found" }
            return response
        }

        const app = await OauthAppModel.findById(token.app_id)
        if(!app) {
            response.error = { code: "invalid-auth-app-not-found", msg: "app not found" }
            return response
        }

        token.status = "revoked"
        await token.save()
        
        // remove cookies if exists
        const client_id = app.data.client_id
        clearCookie(res, `${client_id}_rt`)
        clearCookie(res, `${client_id}_at`)

        response.data = true
        return response
    }),

    grant: t.procedure
    .input(z.object({
        client_id: z.string(),
        response_type: z.enum(["code"]),
        code: z.string().optional(),
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const client_id = opts.input.client_id
        const response_type = opts.input.response_type
        const code = opts.input.code
        const validator = new AccessValidator([])

        const response: ExpressResponse<{ code: string, access: ReturnType<typeof validator['checkResourceAccess']> } | undefined> = {
            data: undefined,
            error: undefined
        }

        const {success, error} = await middlewares(req, config.access.Auth.grant)

        if(!success && error) {
            response.error = error
            return response
        }

        if(!req.user) {
            response.error = { code: "invalid-auth-user-not-found", msg: "user not found" }
            return response
        }

        const is_valid = await basicUserAppValidation(client_id, req.user.roles, ["grant"])
        const access_check = is_valid.access_check
        if(is_valid.code != "ok" || !access_check) {
            response.error = is_valid
            return response
        }

        const token_doc = await BearerTokenModel.findOne({
            _id: code,
            app_id: is_valid.app._id,
            user_id: req.user?._id,
        })

        if(token_doc && token_doc.status != "initilized") {
            response.error = { code: "invalid-auth-token", msg: "token not found" }
            return response
        }

        if(token_doc) {
            response.data = {
                access: is_valid.access_check,
                code: token_doc._id.toString()
            }
            return response
        }

        const token_input: BearerTokenInput = {
            app_id: is_valid.app._id,
            status: "initilized",
            user_id: req.user._id,
            data: undefined
        }

        const token = await BearerTokenModel.create(token_input)
        response.data = { code: token._id.toString(), access: access_check }

        return response
    }),

    authorize: t.procedure
    .input(z.object({
        client_id: z.string()
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const client_id = opts.input.client_id

        const response: ExpressResponse<{ 
            code: string
            authorize_url: string
        } | undefined> = {
            data: undefined,
            error: undefined
        }

        const {success, error} = await middlewares(req, config.access.Auth.authorize)

        if(!success && error) {
            response.error = error
            return response
        }

        if(!req.user) {
            response.error = { code: "invalid-auth-user-not-found", msg: "user not found" }
            return response
        }

        const app = await OauthAppModel.findOne({
            "actions": { $in: ["grant"] },
            "data.client_id": client_id
        })

        if(!app) {
            response.error = { code: "invalid-auth-app-not-found", msg: "app not found" }
            return response
        }

        const client = await app.getClient()

        if(!client) {
            response.error = { code: "invalid-auth-client-not-found", msg: "client not found" }
            return response
        }

        // create new token
        const token_input: BearerTokenInput = { 
            app_id: app._id,
            status: "initilized", 
            user_id: req.user._id,
            data: undefined
        }

        const token = await BearerTokenModel.create(token_input)

        const authorize_url = client.getAuthUrl({
            client_id: app.data.client_id,
            redirect_url: app.data.callback_url,
            state: token._id.toString()
        })

        response.data = { 
            code: token._id.toString(),
            authorize_url
        }
        return response
    }),

    // dynamicly load app client
    // use app client to retrive token
    // update existing token
    callback: t.procedure
    .input(z.object({
        client_id: z.string(),
        code: z.string(),
        state: z.string()
    }))
    .mutation(async (opts) => {
        const req = opts.ctx.req as AccessRequest
        const res = opts.ctx.res
        const client_id = opts.input.client_id
        const code = opts.input.code
        const state = opts.input.state

        const resposne: ExpressResponse<string | undefined> = {
            data: undefined,
            error: undefined
        }

        const {success, error} = await middlewares(req, config.access.Auth.callback)

        if(!success && error) {
            resposne.error = error
            return resposne
        }

        if(!req?.user) {
            resposne.error = { code: "invalid-auth-user-not-found", msg: "user not found" }
            return resposne
        }

        const app = await OauthAppModel.findOne({
            "actions": { $in: allowed_actions },
            "data.client_id": client_id
        })

        if(!app) {
            resposne.error = { code: "invalid-auth-app-not-found", msg: "app not found" }
            return resposne
        }

        const app_client = await app.getClient()
        if(!app_client){
            resposne.error = { code: "invalid-auth-app-client-not-found", msg: "app client not found" }
            return resposne
        }

        const token = await BearerTokenModel.findOne({
            _id: state,
            app_id: app._id,
            user_id: req.user._id,
        })

        if(!token) {
            resposne.error = { code: "invalid-auth-token", msg: "token not found" }
            return resposne
        }

        const options: CallbackOptions = {
            code,
            state,
            app: app.data
        }

        const result = await app_client.callback(options)
        .catch(error => {
            return { data: undefined, error: { code: "invalid-auth-callback", msg: `${error}` } }
        })

        if(!result.data || result.error) {
            resposne.error = result.error
            return resposne
        }

        const token_data: BearerTokenInputData = {
            grant_type: "authorization_code",
            issuer: certbot.env.CERTBOT_DOMAIN,
            access: app.data.access,
            token: result.data
        }

        token.status = "active"
        token.data = token_data
        await token.save()
        
        resposne.data = app.data.redirect_url
        return resposne
    }),
})

export const router = new ExpressRouter()

const middleware = trpcExpress.createExpressMiddleware({
    router: authRouter,
    createContext,
})

router.use = {
    path: "/api/auth", 
    access: config.access.Auth.use, 
    resolve: middleware
}