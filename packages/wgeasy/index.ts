import packagejson from "@ts.app/wgeasy/package.json" with { type: "json" }
import * as env from "@ts.app/wgeasy/configs/env.js"
import { Package, ConfigInput } from "@ts.app/core/common/cli/typestack.js"

const configs: ConfigInput = { env }
const pack = new Package(packagejson, configs, {})

export default pack