import { ServiceConfigInput } from "@ts.app/core"

export default {
    "start": {
        "dev": [
            {"template": "pm2_dev", "service": "next_dev", "name": "NEXT" },
            {"template": "pm2_dev", "service": "express_dev", "name": "EXPRESS" },
            {"template": "pm2_dev", "service": "jobs_dev", "name": "JOBS" }, 
            {"template": "pm2_dev", "service": "graphql_dev", "name": "GRAPHQL" },
            {"template": "pm2_dev", "service": "consumers_dev", "name": "CONSUMER-TS", "e": {"TS_RCS": "tsapp"} }
        ],
        "prod": [
            {"template": "pm2_prod", "service": "next_prod", "name": "NEXT" },
            {"template": "pm2_prod", "service": "express_prod", "name": "EXPRESS" },
            {"template": "pm2_prod", "service": "jobs_prod", "name": "JOBS" }, 
            {"template": "pm2_prod", "service": "graphql_prod", "name": "GRAPHQL" },
            {"template": "pm2_prod", "service": "consumers_prod", "name": "CONSUMER-TS", "e": {"TS_RCS": "tsapp"} }
        ]
    },
    "templates": {
        "pm2_dev": "pm2 start --exp-backoff-restart-delay 100 --watch-delay 1 --time --name ${name} -e ./appdata/logs/tsapp/${name}.error.log -o ./appdata/logs/tsapp/${name}.log ${args} ${script}",
        "pm2_prod": "pm2 start --exp-backoff-restart-delay 100 --time --name ${name} -e ./appdata/logs/tsapp/${name}.error.log -o ./appdata/logs/tsapp/${name}.log ${args} ${script}"
    },
    "services": {
        "next_dev": {
            "script": "@PACKAGE/common/service/next.js",
            "args": "--watch './dist/esm/common/service/next.js'"
        },
        "next_prod": {
            "script": "@PACKAGE/common/service/next.js",
            "args": ""
        },
        "express_dev": {
            "script": "@PACKAGE/common/service/express.js",
            "args": "--watch './packages/*/dist/esm/express/**/*.js' --watch './packages/*/dist/esm/common/**/*.js' --watch './packages/*/dist/esm/models/**/*.js' --watch './codegen/config/output.ts'"
        },
        "express_prod": {
            "script": "@PACKAGE/common/service/express.js",
            "args": ""
        },
        "jobs_dev": {
            "script": "@PACKAGE/common/service/jobs.js",
            "args": "--watch './packages/*/dist/esm/common/**/*.js' --watch './packages/*/dist/esm/models/**/*.js' --watch './codegen/config/output.ts'"
        },
        "jobs_prod": {
            "script": "@PACKAGE/common/service/jobs.js",
            "args": ""
        },
        "graphql_dev": {
            "script": "@PACKAGE/common/service/graphql.js",
            "args": "--watch './packages/*/dist/esm/graphql/**/*' --watch './packages/*/dist/esm/common/**/*.js' --watch './packages/*/dist/esm/models/**/*.js' --watch './codegen/config/output.ts'"
        },
        "graphql_prod": {
            "script": "@PACKAGE/common/service/graphql.js",
            "args": ""
        },
        "consumers_dev": {
            "script": "@PACKAGE/common/service/consumers.js",
            "args": "--watch './packages/*/dist/esm/consumers/**/*.js' --watch './packages/*/dist/esm/express/**/*.js' --watch './packages/*/dist/esm/common/**/*.js' --watch './packages/*/dist/esm/models/**/*.js' --watch './codegen/config/output.ts'"
        },
        "consumers_prod": {
            "script": "@PACKAGE/common/service/consumers.js",
            "args": ""
        }
    }
} satisfies ServiceConfigInput