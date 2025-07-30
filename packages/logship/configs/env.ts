import { ENV, zod, getHost } from "@ts.app/core/common/cli/env.js"

export const logship = new ENV(
    {
        LOGSHIP_PROTOCOL: zod.enum(["http", "https"]),
        LOGSHIP_HOST: zod.string(),
        LOGSHIP_PORT: zod.coerce.number(),
        LOGSHIP_USERNAME: zod.string(),
        LOGSHIP_PASSWORD: zod.string(),
        LOGSHIP_SOURCE: zod.string(),
    },
    {
        LOGSHIP_PROTOCOL: "http", // protocol to use for logship
        LOGSHIP_HOST: "core.haproxy", // hostname that should be reachable from the host and container!
        LOGSHIP_PORT: 8080,
        LOGSHIP_USERNAME: "root",
        LOGSHIP_PASSWORD: "root-psw",
        LOGSHIP_SOURCE: getHost(),
    },
    {
        default: true,
    }
)