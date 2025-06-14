import packagejson from "@ts.app/dev/package.json" with { type: "json" }
import access from "@ts.app/dev/configs/access.js"
import graphql from "@ts.app/dev/configs/graphql.js"
import tailwind from "@ts.app/dev/configs/tailwind.js"
import { Package, ConfigInput } from "@ts.app/core/common/cli/typestack.js"

const configs = { access, graphql, tailwind } satisfies ConfigInput
const pack = new Package(packagejson, configs, {})

export type * from "@ts.app/dev/codegen/graphql.js"
export default pack