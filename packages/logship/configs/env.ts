import { ENV, zod } from "@ts.app/core/common/cli/env.js"

export const logship = new ENV(
    {
        LOGSHIP_HOST: zod.string(),
        LOGSHIP_PORT: zod.coerce.number(),
        LOGSHIP_USERNAME: zod.string(),
        LOGSHIP_PASSWORD: zod.string(),
    },
    {
        LOGSHIP_HOST: "localhost",
        LOGSHIP_PORT: 8080,
        LOGSHIP_USERNAME: "root",
        LOGSHIP_PASSWORD: "root-psw",
    },
    {
        default: true,
    }
)