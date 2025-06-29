import { ServiceConfigInput } from "@ts.app/core"

export default {
    "start": {
        "dev": [
            {"template": "run", "service": "next-dev", "name": "NEXT" },
            {"template": "watch", "service": "express", "name": "EXPRESS" },
            {"template": "watch", "service": "jobs", "name": "JOBS" }, 
            {"template": "watch", "service": "graphql", "name": "GRAPHQL" },
            {"template": "watch", "service": "consumers", "name": "CONSUMER-TS", "e": {"TS_RCS": "tsapp"} }
        ],
        "prod": [
            {"template": "run", "service": "next", "name": "NEXT" },
            {"template": "run", "service": "express", "name": "EXPRESS" },
            {"template": "run", "service": "jobs", "name": "JOBS" }, 
            {"template": "run", "service": "graphql", "name": "GRAPHQL" },
            {"template": "run", "service": "consumers", "name": "CONSUMER-TS", "e": {"TS_RCS": "tsapp"} }
        ]
    },
    "templates": {
        "run": "pm2 start --exp-backoff-restart-delay 100 --name ${name} -e /dev/null -o /dev/null ${args} ${script}",
        "watch": "pm2 start --exp-backoff-restart-delay 100 --watch-delay 0.4 --name ${name} -e /dev/null -o /dev/null --watch '${@ROOT}/packages/*/dist/esm/tsconfig.tsbuildinfo' ${args} ${script}"
    },
    "services": {
        "next": {
            "script": "${@PACKAGE}/dist/esm/common/service/next.js",
        },
        "express": {
            "script": "${@PACKAGE}/dist/esm/common/service/express.js",
        },
        "jobs": {
            "script": "${@PACKAGE}/dist/esm/common/service/jobs.js",
        },
        "graphql": {
            "script": "${@PACKAGE}/dist/esm/common/service/graphql.js",
        },
        "consumers": {
            "script": "${@PACKAGE}/dist/esm/common/service/consumers.js",
        },
        "next-dev": {
            "script": "${@PACKAGE}/dist/esm/common/service/next.js",
            "args": " --watch '${@ROOT}/packages/*/dist/esm/configs/*.js' --watch '${@PACKAGE}/dist/esm/common/service/next.js'"
        },
    }
} satisfies ServiceConfigInput