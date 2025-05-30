import { ENV, zod } from "@ts.app/core/common/cli/env.js"

export const grafana = new ENV(
    {   
        GRAFANA_PORT: zod.coerce.number(),
        GRAFANA_ADMIN_USERNAME: zod.string(),
        GRAFANA_ADMIN_PASSWORD: zod.string(),
    },
    {
        GRAFANA_PORT: 3000,
        GRAFANA_ADMIN_USERNAME: "root",
        GRAFANA_ADMIN_PASSWORD: "root-psw",
    },
    {
        default: true,
    }
)