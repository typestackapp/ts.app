import packagejson from "@ts.app/logship/package.json" with { type: "json" }
import * as env from "@ts.app/logship/configs/env.js"
import { Package, ConfigInput } from "@ts.app/core/common/cli/typestack.js"

const configs = { env } satisfies ConfigInput
const pack = new Package(packagejson, configs, {
    haproxy_defaults: ["log ${@NAMETAG}.haproxy.requests:514 len 4096 format rfc5424 local0 info"]
})

export default pack