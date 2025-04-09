import { TypeStackEntryPoint, TypeStackPackage } from "@ts.app/core/common/cli/typestack.js"
import tscore from "@ts.app/core"

const core : TypeStackEntryPoint = {
  "core": new TypeStackPackage(tscore, { haproxy_rewrite: true, next_disable_alias: true }),
}

export default core