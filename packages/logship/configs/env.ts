import { ENV, zod } from "@ts.app/core/common/cli/env.js"
import child_process from 'child_process'

const getSource = () => {
    try {
        return child_process.execSync('hostname').toString().trim();
    } catch (error) {
        console.error("Failed to get hostname:", error);
        return 'dev';
    }
}

export const logship = new ENV(
    {
        LOGSHIP_HOST: zod.string(),
        LOGSHIP_PORT: zod.coerce.number(),
        LOGSHIP_USERNAME: zod.string(),
        LOGSHIP_PASSWORD: zod.string(),
        LOGSHIP_SOURCE: zod.string(),
    },
    {
        LOGSHIP_HOST: "haproxy", // hostname that should be reachable from the host and container!
        LOGSHIP_PORT: 8080,
        LOGSHIP_USERNAME: "root",
        LOGSHIP_PASSWORD: "root-psw",
        LOGSHIP_SOURCE: getSource(),
    },
    {
        default: true,
    }
)