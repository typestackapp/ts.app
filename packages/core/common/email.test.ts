import { beforeAll, describe, it, expect } from "vitest"
import { EmailInput } from "@ts.app/core/common/email.js"
import { Email } from   "@ts.app/core/common/email.js"
import { EmailConfigModel } from "@ts.app/core/models/config/email.js"
import tscore from "@ts.app/core"

import { setup, Setup } from "@ts.app/core/common/test/setup.js"
var core_tsapp_test: Setup = {} as any
beforeAll(async () => core_tsapp_test = await setup())

describe('Test email config', () => {

    it('should have usable email config', async () => {
        // sending via unvalid email config will thrown: "Exceeded timeout of 5000 ms for a test.
        const config = await EmailConfigModel.findOne({_id: core_tsapp_test.email_config._id})
        if(!config) throw "Config not found!"
        
        config.data.from = config.data.from
        await config.save()
        
        const emai_input: EmailInput = {
            receivers: tscore.config.system.DEV_EMAIL,
            subject: "Test: test configs",
            html: "Email message content from test: should have usable email config",
            attachments: []
        }

        await new Email( emai_input ).send( config )
    })

})