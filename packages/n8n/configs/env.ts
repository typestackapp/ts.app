import { ENV, zod } from "@ts.app/core/common/cli/env.js"

export const grafana = new ENV(
    {   
        BI_PORT: zod.coerce.number(),
        BI_POSTGRES_DATABASE: zod.string(),
        BI_POSTGRES_HOST: zod.string(),
        BI_POSTGRES_PORT: zod.coerce.number(),
        BI_POSTGRES_USER: zod.string(),
        BI_POSTGRES_PASSWORD: zod.string()
    },
    {
        BI_PORT: 5678,
        BI_POSTGRES_DATABASE: "bi",
        BI_POSTGRES_HOST: "postgres",
        BI_POSTGRES_PORT: 5432,
        BI_POSTGRES_USER: "root",
        BI_POSTGRES_PASSWORD: "root-psw"
    },
    {
        default: true,
    }
)