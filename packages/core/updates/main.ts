import { Types } from "mongoose"
import { generateKeyPair, exportJWK } from "jose"
import { JWKConfigDocument, JWKConfigInput, JWKConfigModel, AccessTokenJWKData, RefreshTokenJWKData } from "@ts.app/core/models/config/jwk.js"
import { RoleConfigDocument, RoleConfigModel, RoleConfigInput } from "@ts.app/core/models/config/role.js"
import { OauthAppInput, OauthAppModel } from "@ts.app/core/models/user/app/oauth.js"
import { Transaction } from "@ts.app/core/models/update.js"
import { secretHash, randomSecret } from "@ts.app/core/models/user/access/util.js"
import { UserInput, UserModel } from "@ts.app/core/models/user.js"
import { IAccessInput } from "@ts.app/core"
import { AccessDocument, AccessModel } from "@ts.app/core/models/user/access.js"
import { tsapp, certbot } from "@ts.app/core/configs/env.js"
import { TypeStack } from "@ts.app/core/common/cli/typestack.js"


export const system_admin_id = new Types.ObjectId("62082b4a4a13ab628afc0cce")
export const refresh_token_config_id = new Types.ObjectId("62082b4a4a13ab628afc0ccd")
export const access_token_config_id = new Types.ObjectId("62082b4a4a13ab628afc0ccc")
export const role_config_id = new Types.ObjectId("64ac53099725764a2af1feb2")
export const role_config_name = "SystemAdmin"
export const default_user_app_id = new Types.ObjectId("64ac53099725764a2af1feb3")
export const default_user_app_client_id = "5125b186995939a4b263b835670aab334787815b"
export const all_access_inputs = getAllAccessInputs()

export function getAllAccessInputs(): AccessDocument[] {
    var _access: AccessDocument[] = []
    for(const [pack_key, pack] of Object.entries(TypeStack.config.packages)) {
        const active_access = pack.pack.config.access
        if(!active_access) continue
        let doc_input: IAccessInput = {
            status: "Enabled",
            pack: pack.pack.json.name,
            resource: undefined, // allow access to all resources
            action: undefined, // allow access to all actions
            permissions: ["Read", "Write", "Update", "Delete"]
        }
        _access.push(new AccessModel(doc_input))
    }
    return _access
}

export const transaction: Transaction = async (session, update) => {
    const host = `https://${certbot.env.CERTBOT_DOMAIN}:${tsapp.env.TS_PORT}`

    // ADD JWT FOR REFRESH TOKEN
    const refresh_token_config = await JWKConfigModel.findOne({ _id: refresh_token_config_id }, {}, { session })
    if(!refresh_token_config) {
        const pair = await generateKeyPair("RS256")
        const key = await exportJWK(pair.privateKey)
        const refresh_token_config_input: JWKConfigInput<RefreshTokenJWKData> = {
            _id: refresh_token_config_id,
            created_by: system_admin_id,
            updated_by: system_admin_id,
            title: "Default refresh token jwt config",
            cacheSeconds: tsapp.env.TS_ENV_TYPE == "dev" ? 20 : 3600,
            key,
            data: {
                renewBefore: tsapp.env.TS_ENV_TYPE == "dev" ? "20s" : "60s",
                extendTime: tsapp.env.TS_ENV_TYPE == "dev" ? "2m" : "30d",
                renewAfter: tsapp.env.TS_ENV_TYPE == "dev" ? `60s` : `30d`,
                extendLifeTime: true,
                headerAlg: "RS256",
            }
        }
        await JWKConfigModel.findOneAndUpdate<JWKConfigDocument<RefreshTokenJWKData>>(
            { _id: refresh_token_config_id },
            refresh_token_config_input,
            { upsert: true, new: true, session }
        )
        update.log.push({ type: "refresh_token_config", msg: "upserted" })
    } else {
        update.log.push({ type: "refresh_token_config", msg: "already exists" })
    }


    // ADD JWT FOR ACCESS TOKEN
    const access_token_config = await JWKConfigModel.findOne({ _id: access_token_config_id }, {}, { session })
    if(!access_token_config) {
        const pair = await generateKeyPair("RS256")
        const key = await exportJWK(pair.privateKey)
        const access_token_config_input: JWKConfigInput<AccessTokenJWKData> = {
            _id: access_token_config_id,
            created_by: system_admin_id,
            updated_by: system_admin_id,
            title: "Default access token jwt config",
            cacheSeconds: tsapp.env.TS_ENV_TYPE == "dev" ? 20 : 3600,
            key,
            data:{
                renewBefore: tsapp.env.TS_ENV_TYPE == "dev" ? "10s" : "60s",
                extendTime: tsapp.env.TS_ENV_TYPE == "dev" ? "24h" : "30m",
                headerAlg: "RS256",
            }
        }
        await JWKConfigModel.findOneAndUpdate<JWKConfigDocument<AccessTokenJWKData>>(
            { _id: access_token_config_id },
            access_token_config_input,
            { upsert: true, new: true, session }
        )
        update.log.push({ type: "access_token_config", msg: "upserted" })
    } else {
        update.log.push({ type: "access_token_config", msg: "already exists" })
    }

    
    // CREATE DEFAULT SystemAdmin USER ROLE CONFIG
    const role_config_input: RoleConfigInput = {
        _id: role_config_id,
        created_by: system_admin_id,
        updated_by: system_admin_id,
        title: "SystemAdmin role config",
        data: {
            name: role_config_name,
            resource_access: all_access_inputs,
            graphql_access: [{
                pack: "@ts.app/core",
                services: ["admin"]
            }]
        }
    }
    await RoleConfigModel.findOneAndUpdate<RoleConfigDocument>(
        { _id: role_config_input._id },
        role_config_input,
        { upsert: true, new: true, session, setDefaultsOnInsert: true }
    )
    update.log.push({ type: "role_config", msg: "upserted" })


    // CREATE DEFAULT USER APP
    const default_user_app_input: OauthAppInput = {
        _id: default_user_app_id,
        actions: ["register", "login", "grant"],
        client: "@ts.app/core/models/user/app/oauth/client/tsapp.js",
        data: {
            client_id: default_user_app_client_id,
            client_secret: randomSecret(40),
            access: all_access_inputs,
            roles: [role_config_name],
            grants: [
                { type: "authorization_code" },
                { type: "refresh_token" },
                { type: "password" },
                { type: "client_credentials" }
            ],
            callback_url: `${host}/auth/callback/5125b186995939a4b263b835670aab334787815b`,
            redirect_url: `${host}/admin`,
            token_url: tsapp.env.TS_ENV_TYPE == "dev" ? `http://${tsapp.env.TS_IP}:8000/api/auth/token` : `${host}/api/auth/token` 
        },
        icon: `https://${certbot.env.CERTBOT_DOMAIN}:${tsapp.env.TS_PORT}/public/logo.png`,
        name: certbot.env.CERTBOT_DOMAIN,
        description: `Use ${certbot.env.CERTBOT_DOMAIN} account`,
        created_by: system_admin_id,
        updated_by: system_admin_id
    }

    let default_user_app = await OauthAppModel.findOne({ _id: default_user_app_id }, {}, { session })
    update.log.push({ type: "default_user_app", msg: default_user_app ? "found" : "not found" })
    if(default_user_app) {
        default_user_app.data.access = all_access_inputs
        default_user_app.data.roles = [role_config_name]
        update.log.push({ type: "default_user_app", msg: "access updated" })
        await default_user_app.save({ session })
    } else {
        await OauthAppModel.findOneAndUpdate<OauthAppInput>(
            { _id: default_user_app_id },
            default_user_app_input,
            { upsert: true, new: true, session }
        )
        update.log.push({ type: "default_user_app", msg: "created" })
    }

    // UPDATE SYSTEM ADMIN USER
    const system_admin_input: UserInput = {
        _id: system_admin_id,
        usn: tsapp.env.TS_INIT_EMAIL,
        psw: secretHash(tsapp.env.TS_INIT_PSW),
        roles: ["SystemAdmin"]
    }
    await UserModel.findOneAndUpdate<UserInput>(
        { _id: system_admin_id },
        system_admin_input,
        { upsert: true, new: true, session }
    )
    update.log.push({ type: "system_admin", msg: "upserted" })
}