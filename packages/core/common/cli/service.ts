import { exec } from "child_process"
import { CWD, TypeStack } from "@ts.app/core/common/cli/typestack.js"
import path from "path"

export type ServiceOptions = {
    cwd: CWD // current working directory
    up: any // start all services
    //down: any // stop all services
    //start: any // boolean, start specific service, by name
    //stop: any // boolean, stop specific service, by name
    env: any // string // dev | prod
}

export const service = async (options: ServiceOptions) => {
    const cwd = options.cwd
    const root_full_path = cwd.workspace || cwd.typestack

    if(!options.up) throw `Error, missing start or up option`
    if(typeof options.env != 'string') throw `Error, missing env option`
    if(!['prod', 'dev', 'stage'].includes(options.env)) console.log(`Warning, env should be one of prod, dev, stage`)
    if(!root_full_path) throw `Error, root path not found in cwd: ${JSON.stringify(cwd)}`
    
    const config = await TypeStack.getConfig()
    const env = options.env

    // start all services for all packages
    for( const [alias, pack] of Object.entries(config.packages) ) {
        const pack_key = pack.pack.json.name
        if(!pack.pack.config?.services?.start || !pack.pack.config?.services?.start[env]) continue

        const start = pack.pack.config.services.start[env]
        const templates = pack.pack.config.services.templates
        const services = pack.pack.config.services.services

        if(!start || start.length == 0) {
            console.log(`No services to start for ${pack_key} package`)
            continue
        }else {
            console.log(`Starting services for ${pack_key} package`)
        }

        for(const service of start) {
            const process_name = service.name
            const template_name = service.template
            const service_name = service.service
            const run_before = service.run_before
            const service_env_vars = service.e

            // check if service exists under services
            if(!services[service_name]) throw `Error, service ${service_name} not found in ${pack_key} package services`

            // prepare commands
            const template = templates[template_name]
            const script = services[service_name].script
            const service_args = services[service_name].args
            const env_vars = { ...process.env, ...service_env_vars }
            const root_path = path.relative(process.cwd(), root_full_path)

            var command = run_before ? `${run_before} && ` : ''
            command += template
                .replaceAll('${name}', process_name)
                .replaceAll('${script}', script)
                .replaceAll('${args}', service_args || '')
                .replaceAll('${@PACKAGE}', `${cwd.node_modules}/${pack.pack.json.name}`)
                .replaceAll('${@ROOT}', root_path)
            
            console.log(`Starting ${process_name} server in ${env} enviroment, cwd: ${process.cwd()}`)
            console.log(`Enviroment variables: ${JSON.stringify(env_vars)}`)
            console.log(`Command: ${command}`)
            
            // start service
            await execAsync(command, env_vars)
        }
    }
}

function execAsync(command: string, env_vars: any) {
    return new Promise((resolve, reject) => {
        exec(command, { env: env_vars }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                reject(error)
            }
            console.log(`stdout: ${stdout}`)
            console.error(`stderr: ${stderr}`)
            resolve(stdout)
        })
    })
}
