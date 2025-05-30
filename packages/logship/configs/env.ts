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
        LOGSHIP_PASSWORD: "'$2b$10$h3wG/3r8Yw.ArNxKWUQ2.Ohsjbjt5xSf4DsGY9U6PQvv7LoFecvB.'",
    },
    {
        default: true,
    }
)