import { describe, it, expect } from "vitest"
import tscore from "@ts.app/core"

describe('Test global variabless', async () => {
    it('should have global config', () => {
        expect(tscore.config).to.exist
    })

    it('should have global db', async () => {
        expect(tscore.db.mongoose.core).to.exist
    })
})