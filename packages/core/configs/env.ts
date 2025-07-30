import { ENV, zod } from "@ts.app/core/common/cli/env.js"
import { randomSecret } from "@ts.app/core/models/user/access/util.js"
import { createHash } from "crypto"

export const tsapp = new ENV(
    {
        TS_ENV_TYPE: zod.string(),
        TS_ENTRY_POINT: zod.string(),
        TS_AUTH_SECRET: zod.string(),
        TS_PORT: zod.string(),
        TS_IP: zod.string().ip(),
        TS_VOLUME: zod.string().default('["../../../../:/tsapp/"]'),
        TS_SUBNET: zod.string(),
        TS_TIME_ZONE: zod.string(),
        TS_INIT_PSW: zod.string(),
        TS_INIT_EMAIL: zod.string().email(),
        TS_RCS: zod.string().default("").optional(),
        TS_NEXT_PORT: zod.string().default("8010").optional(),
        TS_API_PORT: zod.string().default("8011").optional(),
        TS_GRAPHQL_PORT: zod.string().default("8013").optional(),
    },
    {
        TS_ENV_TYPE: "dev",
        TS_ENTRY_POINT: "/tsapp/packages/dev",
        TS_AUTH_SECRET: createHash('sha256').update(randomSecret(32)).digest('hex'),
        TS_PORT: "7443",
        TS_IP: "10.44.44.44",
        TS_VOLUME: '["../../../../:/tsapp/"]',
        TS_SUBNET: "10.44.44.0/24",
        TS_TIME_ZONE: "UTC",
        TS_INIT_PSW: "root-psw",
        TS_INIT_EMAIL: "test@test.com",
        TS_RCS: "",
        TS_NEXT_PORT: "8010",
        TS_API_PORT: "8011",
        TS_GRAPHQL_PORT: "8013",
    },
    {
        default: true,
    }
)

export const haproxy = new ENV(
    {
        HAPROXY_IP: zod.string().ip(),
        HAPROXY_PORT: zod.string(),
        HAPROXY_MAXCONN: zod.string()
    },
    {
        HAPROXY_IP: "10.44.44.41",
        HAPROXY_PORT: '["7443:7443", "7444:7444"]',
        HAPROXY_MAXCONN: "2048"
    },
    {
        default: true,
    }
)

export const certbot = new ENV(
    {
        CERTBOT_DOMAIN: zod.string(),
        CERTBOT_IP: zod.string().ip(),
        CERTBOT_PORT: zod.string(),
        CERTBOT_SELFSIGNED: zod.coerce.boolean().default(false).optional(),
        CERTBOT_INIT: zod.coerce.boolean().default(false).optional(),
        CERTBOT_RESTART_TIME: zod.string().default("12h").optional(), // [12s, 12h]
        CERTBOT_EXTRA_DOMAIN_NAMES: zod.string().default("").optional(), // -d a.foo.com -d *.bar.com
        CERTBOT_EMAIL: zod.string().email(),
    },
    {
        CERTBOT_DOMAIN: "localhost",
        CERTBOT_IP: "10.44.44.40",
        CERTBOT_PORT: "80",
        CERTBOT_SELFSIGNED: true,
        CERTBOT_INIT: false,
        CERTBOT_RESTART_TIME: "12h",
        CERTBOT_EXTRA_DOMAIN_NAMES: "",
        CERTBOT_EMAIL: "test@test.com"
    },
    {
        default: true,
    }
)

export const mongo = new ENV(
    {
        MONGO_PORT: zod.string(),
        MONGO_IP: zod.string().ip(),
        MONGO_HOST: zod.string(),
        MONGO_DB_NAME: zod.string(),
        MONGO_USERNAME: zod.string(),
        MONGO_PASSWORD: zod.string(),
        MONGO_KEY_PATH: zod.string(),
        MONGO_DB_PATH: zod.string(),
        MONGO_BIND_IP: zod.string().ip(),
    },
    {
        MONGO_PORT: "27017",
        MONGO_IP: "10.44.44.43",
        MONGO_HOST: "core.mongo:27017",
        MONGO_DB_NAME: "tsapp",
        MONGO_USERNAME: "root",
        MONGO_PASSWORD: "root-psw",
        MONGO_KEY_PATH: "/configs/mongo/mongo.key",
        MONGO_DB_PATH: "/data/db/",
        MONGO_BIND_IP: "0.0.0.0"
    }
)

export const rabbitmq = new ENV(
    {
        RABBITMQ_PORT: zod.string(),
        RABBITMQ_IP: zod.string().ip(),
        RABBITMQ_DEFAULT_USER: zod.string(),
        RABBITMQ_DEFAULT_PASS: zod.string(),
    }, 
    {
        RABBITMQ_PORT: "7444",
        RABBITMQ_IP: "10.44.44.42",
        RABBITMQ_DEFAULT_USER: "root",
        RABBITMQ_DEFAULT_PASS: "root-psw",
    }
)