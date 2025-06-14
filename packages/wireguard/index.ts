import packagejson from "@ts.app/wireguard/package.json" with { type: "json" }
import * as env from "@ts.app/wireguard/configs/env.js"
import { Package, ConfigInput } from "@ts.app/core/common/cli/typestack.js"

const configs = { env } satisfies ConfigInput
const pack = new Package(packagejson, configs, {})

export default pack