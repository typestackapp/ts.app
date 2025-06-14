#!/usr/bin/env node
import 'source-map-support/register.js'
import type { ConfigOptions } from "@ts.app/core/common/cli/config.js"
import type { ServiceOptions } from "@ts.app/core/common/cli/service.js"
import { GraphqlOptions } from '@ts.app/core/common/cli/graphql.js'
import { DefaultOptions } from "@ts.app/core/common/cli/util.js"
import { TypeStack } from '@ts.app/core/common/cli/typestack.js'
import { UpdateOptions } from "@ts.app/core/common/cli/update.js"
import { PswOptions } from "@ts.app/core/common/cli/psw.js"

import minimist from "minimist"

const argv = minimist(process.argv.slice(2))
const action = argv['_'][0]
const cwd = TypeStack.findCWD(undefined, argv.cwd)
const exeptions = ['psw']

console.log(`Using ${cwd.entrypoint} config: ${cwd.typestack}/typestack.ts`)
console.log(`Using action: ${action} with args:`, argv)

if(!cwd.typestack && !exeptions.includes(action)) {
    console.log(`Could not find typestack entry point`)
    process.exit(1)
}

const config_options: ConfigOptions = {
    cwd: cwd,
    link: (argv.link == undefined)? true : argv.link
}

const service_options: ServiceOptions = {
    cwd,
    up: argv?.up,
    env: argv?.env
}

const graphql_options: GraphqlOptions = {
    cwd
}

const update_options: UpdateOptions = {
    cwd
}

const default_options: DefaultOptions = {
    cwd: cwd,
    argv: process.argv
}

const psw_options: PswOptions = {
    p: argv.p,
    a: argv.a || 'bcrypt'
}

switch(action) {
    case 'config':
        import("@ts.app/core/common/cli/config.js")
        .then(module => module.config(config_options))
        .catch(error => console.log(error))
    break
    case 'graphql':
        import("@ts.app/core/common/cli/graphql.js")
        .then(module => module.graphql(graphql_options))
        .catch(error => console.log(error))
    break
    case 'update':
        import("@ts.app/core/common/cli/update.js")
        .then(module => module.update(update_options))
        .catch(error => console.log(error))
    break
    case 'service':
        import("@ts.app/core/common/cli/service.js")
        .then(module => module.service(service_options))
        .catch(error => console.log(error))
    break
    case 'cleanup':
        import("@ts.app/core/common/cli/cleanup.js")
        .then(module => module.cleanup(default_options))
        .catch(error => console.log(error))
    break
    case 'psw':
        import("@ts.app/core/common/cli/psw.js")
        .then(module => module.psw(psw_options))
        .catch(error => console.log(error))
    default:
        console.log(`Unknown action: ${action}`)
        console.log(`Available actions: init, config, service, docker, update`)
    break
}