import { beforeAll, describe, it, expect } from "vitest"
import { secretCompare } from "@ts.app/core/models/user/access/util.js"
import { tsapp } from "@ts.app/core/configs/env.js"

import { setup, Setup } from "@ts.app/core/common/test/setup.js"
var core_tsapp_test: Setup = {} as any
beforeAll(async () => core_tsapp_test = await setup())

describe('Test users', () => {
    it('should check if password can be validated', async () => {
        const is_valid = secretCompare(tsapp.env.TS_INIT_PSW as string, core_tsapp_test.root_user.psw)
        expect(is_valid).to.be.true
    })

    it('should check if password cant be validated', async () => {
        const is_valid = secretCompare("never-use-this-psw" as string, core_tsapp_test.root_user.psw)
        expect(is_valid).to.be.false
    })
})