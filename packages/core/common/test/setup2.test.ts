import { describe, it, expect } from "vitest"
import { setup } from "@ts.app/core/common/test/setup.js"
const env = await setup()

describe('Test global variabless', async () => {
    it('should have global jobs', () => {
        expect(env.jobs).to.exist
    })
})