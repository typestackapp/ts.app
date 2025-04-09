import { beforeAll, describe, it, expect } from "vitest"
import moment from "moment"
import { DeepPartial } from "utility-types"
import { Types } from "mongoose"
import { newRefreshToken, newAccessToken } from "@ts.app/core/models/user/util.js"
import { default_user_app_client_id } from "@ts.app/core/updates/main.js"
import { AccessInput, AccessOptions, UserAccessLogModel, UserAccessLogInput } from "@ts.app/core/models/user/access.js"
import { AccessRequest, auth, validateApiKey, validateBearerKey } from "@ts.app/core/models/user/access/middleware.js"
import { AccessValidator, AccessCheckOptions } from "@ts.app/core/models/user/access/util.js"

var token: Awaited<ReturnType<typeof newRefreshToken>>
const client_id = default_user_app_client_id

import { api_key_base64, setup, Setup } from "@ts.app/core/common/test/setup.js"
var core_tsapp_test: Setup = {} as any
beforeAll(async () => core_tsapp_test = await setup())

describe('Test Bearer token', () => {
    it('should use valid access token and suceed', async () => {
        token = await newRefreshToken(core_tsapp_test.root_user, client_id, "refresh_token", {
            time: moment().subtract(10, 'seconds'), // token was created 10 seconds ago
            accessTokenExtendTime: "20s" // access token is valid for 20 seconds
        })
        
        await validateBearerKey(token.key.access.tk, {
            time: moment().subtract(0, 'seconds'), // token is used now, should be valid and not throw any error
            accessTokenExtendTime: "20s" // access token is valid for 20 seconds
        }, "Bearer")
    })

    it('should use expired access token and fail', async () => {
        token = await newRefreshToken(core_tsapp_test.root_user, client_id, "refresh_token", {
            time: moment().subtract(20, 'seconds'), // token was created 20 seconds ago
            accessTokenExtendTime: "10s" // access token is valid for 10 seconds
        })
        
        const is_ok = await validateBearerKey(token.key.access.tk, {
            time: moment().subtract(0, 'seconds'), // token is used now, should be invalid and throw error
            accessTokenExtendTime: "10s"
        }, "Bearer")
        .then(user => false)
        .catch(error => true)

        expect(is_ok).to.be.equal(true)
    })

    it('should retrive new access token', async () => {
        const refresh_token = token.key.refresh.tk
        const access_token = token.key.access.tk

        token = await newAccessToken(refresh_token, access_token, {
            time: moment().subtract(0, 'seconds'), // token is used now, should allow to retrive new access token
            accessTokenExtendTime: "10s"
        })

        expect(token.key.access.tk).to.be.not.equal(access_token)
    })

    it('should retrive new refresh token', async () => {
        const refresh_token = token.key.refresh.tk
        const access_token = token.key.access.tk

        token = await newAccessToken(refresh_token, access_token, {
            time: moment().subtract(15, 'seconds'),
            refreshTokenRenewBefore: "5s",
            refreshTokenExtendTime: "30s",
            refreshTokenExtendLifetime: true
        })

        expect(token.key.refresh.tk).to.be.not.equal(refresh_token)
    })

    it('should not retrive new refresh token', async () => {
        const refresh_token = token.key.refresh.tk
        const access_token = token.key.access.tk

        token = await newAccessToken(refresh_token, access_token, {
            time: moment().subtract(15, 'seconds'),
            refreshTokenRenewBefore: "5s",
            refreshTokenExtendTime: "30s",
            refreshTokenExtendLifetime: false
        })
        expect(token.key.refresh.tk).to.be.equal(refresh_token)
    })
})


describe('Test ApiKey token', () => {
    beforeAll(async () => {
        // console.log(`Your api key secret: ${api_key_secret}`)
        console.log(`Your api key: ApiKey%20${api_key_base64}`)
    })

    it('should have global apikey', async () => {
        expect(core_tsapp_test.api_key).to.exist
    })

    it('should throw error while getting non existing apikey', async () => {
        const is_ok = await validateApiKey('some-random-key')
        .then(user => false)
        .catch(error => true)
        expect(is_ok).to.be.equal(true)
    })

    it('should use new apikey and get valid user key', async () => {
        const user = await validateApiKey(api_key_base64)
        expect(user).to.exist
    })
})


describe('Test access', () => {
    const user_pack_access: AccessInput = {
        pack: "@ts.app/core",
        status: "Enabled",
        permissions: ["Write", "Delete"]
    }

    const user_resource_access: AccessInput = {
        pack: "@ts.app/core",
        status: "Enabled",
        resource: "User",
        permissions: ["Write", "Delete"]
    }

    const user_read_access: AccessInput = {
        pack: "@ts.app/core",
        status: "Enabled",
        resource: "User",
        action: "getCurrentUser",
        permissions: ["Read"]
    }

    const user_write_access: AccessInput = {
        pack: "@ts.app/core",
        status: "Enabled",
        resource: "User",
        action: "getCurrentUser",
        permissions: ["Write"]
    }

    it('should allow pass type AccessOptions to function checkAccess', async () => {
        const access: AccessInput[] = [] as AccessInput[]
        const options: AccessOptions = {} as AccessOptions
        const validator = new AccessValidator(access)
        validator.checkAccess(options)
    })

    it('should have access if auth.permission is undefined', async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: undefined
        }
        const validator = new AccessValidator([user_read_access])
        expect(validator.checkAccess(options)).to.be.equal(true)
    })

    it('should have access if auth.permission is Read', async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Read"
        }
        const validator = new AccessValidator([user_read_access])
        expect(validator.checkAccess(options)).to.be.equal(true)
    })

    it('should not have access if auth.permission is Write', async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([user_read_access])
        expect(validator.checkAccess(options)).to.be.equal(false)
    })

    it('should have access via top level user_resource_access', async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([user_resource_access])
        expect(validator.checkAccess(options)).to.be.equal(true)
    })

    it('should not have read access via top level user_resource_access', async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "Test",
            action: "getPing",
            permission: "Read"
        }
        const validator = new AccessValidator([user_resource_access])
        expect(validator.checkAccess(options)).to.be.equal(false)
    })

    it('should not have access if user_resource_access.status is Disabled' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_resource_access, status: "Disabled" }])
        expect(validator.checkAccess(options)).to.be.equal(false)
    })

    it('should not have access to action getPing' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "Test",
            action: "getPing",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_resource_access }])
        expect(validator.checkAccess(options)).to.be.equal(false)
    })

    it('should not have access to test package' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core/test" as any,
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_resource_access }])
        expect(validator.checkAccess(options)).to.be.equal(false)
    })

    it('should have access for action in resource' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_resource_access }])
        expect(validator.checkAccess(options)).to.be.equal(true)
    })

    it('should have access if resource is disabled, but action is explicitly enabled' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_resource_access, status: "Disabled" }, user_write_access])
        expect(validator.checkAccess(options)).to.be.equal(true)
    })

    it('should not have access if resource is enabled, but action is explicitly disabled' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_resource_access }, { ...user_write_access, status: "Disabled" }])
        expect(validator.checkAccess(options)).to.be.equal(false)
    })

    it('should have pack level access' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([user_pack_access])
        expect(validator.checkAccess(options)).to.be.equal(true)
    })

    it('should have access if pack is disabled, but action is explicitly enabled' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_pack_access, status: "Disabled" }, user_write_access])
        expect(validator.checkAccess(options)).to.be.equal(true)
    })

    it('should not have access if pack is enabled, but action is explicitly disabled' , async () => {
        const options: AccessCheckOptions = {
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            permission: "Write"
        }
        const validator = new AccessValidator([{ ...user_pack_access }, { ...user_write_access, status: "Disabled" }])
        expect(validator.checkAccess(options)).to.be.equal(false)
    })

    it('should log user on auth' , async () => {
        const options: AccessOptions = {
            enabled: true,
            pack: "@ts.app/core",
            resource: "User",
            action: "getCurrentUser",
            resourceAction: "User_getCurrentUser",
            log: { enabled: true },
            auth: { enabled: true, tokens: ["ApiKey"] }
        }

        const input: UserAccessLogInput = {
            access: options,
            req_id: new Types.ObjectId(),
            device: {
                ip_address: "10.10.10.44",
                agent: "test agent"
            }
        }

        const log = await UserAccessLogModel.create(input)
        const req: DeepPartial<AccessRequest> = {
            headers: {
                authorization: `ApiKey ${api_key_base64}`
            }
        }

        await auth(req as any, options, log)

        expect(log?.user).to.be.not.undefined
        expect(log?.user?.id).to.be.not.undefined
        expect(log?.user?.token_id).to.be.not.undefined
        expect(log?.user?.token_type).to.be.not.undefined
    })

})