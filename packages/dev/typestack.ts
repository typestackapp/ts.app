import { TypeStackEntryPoint, TypeStackPackage } from "@ts.app/core/common/cli/typestack.js"
import tscore from "@ts.app/core"
import tsdev from "@ts.app/dev"
import grafana from "@ts.app/grafana"
import logship from "@ts.app/logship"
import wireguard from "@ts.app/wireguard"

const dev : TypeStackEntryPoint = {
  "core": new TypeStackPackage(tscore, { haproxy_rewrite: true, next_disable_alias: true }),
  "dev": new TypeStackPackage(tsdev),
  "grafana": new TypeStackPackage(grafana),
  "logship": new TypeStackPackage(logship),
  "wireguard": new TypeStackPackage(wireguard),
}

export default dev