import packagejson from "@ts.app/n8n/package.json" with { type: "json" }
import * as env from "@ts.app/n8n/configs/env.js"
import { Package, ConfigInput } from "@ts.app/core/common/cli/typestack.js"

const configs = { env } satisfies ConfigInput
const pack = new Package(packagejson, configs, {})

export default pack