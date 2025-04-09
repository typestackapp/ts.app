import { TypeStackEntryPoint, TypeStackPackage } from "@ts.app/core/common/cli/typestack.js"
import tscore from "@ts.app/core"
import tsdev from "@ts.app/dev"
import tswireguard from "@ts.app/wireguard"

const dev : TypeStackEntryPoint = {
  "core": new TypeStackPackage(tscore, { haproxy_rewrite: true, next_disable_alias: true }),
  "dev": new TypeStackPackage(tsdev),
  "wireguard": new TypeStackPackage(tswireguard),
}

export default dev