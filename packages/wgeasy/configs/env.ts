import { ENV, zod } from "@ts.app/core/common/cli/env.js"

export const grafana = new ENV(
    {   
        WGEASY_PORT: zod.coerce.number(),
        WGEASY_USERNAME: zod.string(),
        WGEASY_PASSWORD: zod.string(),
        WGEASY_HOST: zod.string(),
        WGEASY_IPV4_CIDR: zod.string(),
        WGEASY_IPV6_CIDR: zod.string(),
    },
    {
        WGEASY_PORT: 51821,
        WGEASY_USERNAME: "root",
        WGEASY_PASSWORD: "root-psw",
        WGEASY_HOST: "localhost",
        WGEASY_IPV4_CIDR: " 172.20.0.0/20", // 4096 addresses, 172.20.0.0 to 172.20.15.255
        WGEASY_IPV6_CIDR: "fd00:abcd:1234::/64"
    },
    {
        default: true,
    }
)