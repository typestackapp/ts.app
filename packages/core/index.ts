import packagejson from "@ts.app/core/package.json" with { type: "json" }
import access from "@ts.app/core/configs/access.js"
import countrys from "@ts.app/core/configs/countrys.js"
import db from "@ts.app/core/configs/db.js"
import * as env from "@ts.app/core/configs/env.js"
import frontend from "@ts.app/core/configs/frontend.js"
import graphql from "@ts.app/core/configs/graphql.js"
import rabbitmq from "@ts.app/core/configs/rabbitmq.js"
import services from "@ts.app/core/configs/services.js"
import system from "@ts.app/core/configs/system.js"
import templates from "@ts.app/core/configs/templates.js"
import timezones from "@ts.app/core/configs/timezones.js"
import tailwind from "@ts.app/core/configs/tailwind.js"
import { Package } from "@ts.app/core/common/cli/typestack.js"

const configs = { access, countrys, db, env, frontend, graphql, rabbitmq, services, system, templates, timezones, tailwind }
const options = { haproxy_rewrite: true, next_disable_alias: true }
const pack = new Package(packagejson, configs, options)

export * from "@ts.app/core/common/service.js"
export * from "@ts.app/core/common/cli/typestack.js"
export * from "@ts.app/core/common/cli/typedefs.js"
export type * from "@ts.app/core/codegen/admin/index.js"

export default pack