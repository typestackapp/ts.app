import { ENV, zod } from "@ts.app/core/common/cli/env.js"

export const wireguard = new ENV(
    {
        WIREGUARD_PORT: zod.string().default("51820"),
        WIREGUARD_SERVERURL: zod.string().default("auto"),
        WIREGUARD_PEERS: zod.coerce.number().int().default(50),
        WIREGUARD_PEERDNS: zod.string().ip().default("1.1.1.1"),
        WIREGUARD_ALLOWEDIPS: zod.string().default("10.44.44.0/24"),
        WIREGUARD_INTERNAL_SUBNET: zod.string().ip().default("10.10.1.0")
    },
    {
        WIREGUARD_PORT: "51820",
        WIREGUARD_SERVERURL: "auto",
        WIREGUARD_PEERS: 50,
        WIREGUARD_PEERDNS: "1.1.1.1",
        WIREGUARD_ALLOWEDIPS: "10.44.44.0/24",
        WIREGUARD_INTERNAL_SUBNET: "10.10.1.0"
    }
)