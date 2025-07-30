import fs from 'fs'
import { 
    emptyDir, prepareEnvVars, prepareDockerFile, 
    mkDirRecursive, getSymLink, unlinkFolder,
    linkFolder, AppConfigInput, generateHash,
    getAdminAppsFile, templateReplace
} from '@ts.app/core/common/cli/util.js'
import child_process from 'child_process'
import { getHost, Module } from '@ts.app/core/common/cli/env.js'
import path from 'path'
import moment from 'moment'
import { TypeStack, CWD, TypeStackOutputPackage as Package } from '@ts.app/core/common/cli/typestack.js'
import chalk from 'chalk'

const exec = child_process.execSync

export type ConfigOptions = {
    cwd: CWD
    link: boolean // create symlinks
}

export type Packages = {
    [key: string]: {}
}

export const config = async (options: ConfigOptions) => {
    const ts = await TypeStack.getConfig()
    const cwd = ts.cwd
    const packages = ts.packages
    const entry = ts.entrypoint
    const link = options.link

    // ----------------- BACKUP --------------------
    const appdata = `${cwd.typestack}/appdata`
    const output_folder_tmp = `${cwd.typestack}/tmp/${moment().format('YYYY-MM-DD-HH-mm-ss')}`
    if(!cwd) throw new Error("Missing cwd in options")

    console.log(`Using packages: ${Object.keys(packages).join(', ')}`)

    // create appdata folder if not exists
    if(!fs.existsSync(appdata)) fs.mkdirSync(appdata, { recursive:true })
    // create tmp folder if not exists
    if(!fs.existsSync(output_folder_tmp)) fs.mkdirSync(output_folder_tmp, { recursive:true })
    
    // copyRecursiveSync(appdata, output_folder_tmp) // copy all contents of appdata to tmp folder
    // run cli comand to copy all files
    try {
        // check if env is dev
        const tsapp = (await import('@ts.app/core/configs/env.js')).tsapp
        if(tsapp.try?.TS_ENV_TYPE === 'prod') {
            exec(`sudo cp -r ${appdata} ${output_folder_tmp}`)
            console.log(chalk.green(`Config backup created in ${output_folder_tmp}`))
        }
    } catch (error) {
        console.error(chalk.red(`Error while copying appdata to ${output_folder_tmp}`))
    }

    // ---------------- ENV --------------------
    // read all env modules
    const env_modules: {
        key: string,
        pack: Package,
        mod: Module
    }[] = []
    for(const [pack_alias, pack] of Object.entries(packages)) {
        const pack_name = pack.pack.json.name
        try {
            env_modules.push({
                key: pack_name,
                pack: pack,
                mod: (await import(`${pack_name}/configs/env.js`)) as Module
            })
        }catch (error) {
            if(fs.existsSync(`${cwd.node_modules}/${pack_name}/configs/env.js`)) {
                console.error(chalk.red(`Error while loading env vars in packages/${pack_alias} error: ${error}`))
            }else{
                // console.warn(chalk.yellow(`Warning: No env module found for ${pack_name}`))
                env_modules.push({
                    key: pack_name,
                    pack: pack,
                    mod: {}
                })
            }
        }
    }

    // create example env files if not exists
    for(const {key: pack_name, pack, mod} of env_modules) {
        const env_file = `${cwd.node_modules}/${entry.pack.json.name}/appdata/env/${pack.alias}.env`
        let env_file_content = ""
        // create folder if not exists
        if(!fs.existsSync(path.dirname(env_file))) {
            fs.mkdirSync(path.dirname(env_file), { recursive:true })
        }
        if(!fs.existsSync(env_file)) {
            for(const [env_key , module] of Object.entries(mod).reverse()) {
                if(env_key == "default") continue
                env_file_content += `# ${pack.pack.json.name} ${env_key}\n${module.exampleFile()}\n\n`
            }
            fs.writeFileSync(env_file, env_file_content)
        }else {
            // TODO do update if already exists
            // add missing env vars?
        }
    }

    // ---------------- DOCKER --------------------
    // read all docker templates
    const docker_template_files: {
        [pack_name: string]: {
            [file_name: string]: {
                input_file_name: string,
                content?: string | Buffer
            } | undefined
        } | undefined
    } = {}

    for(const [pack_alias, pack] of Object.entries(packages)) {
        const pack_name = pack.pack.json.name
        const docker_folder = `${cwd.node_modules}/${pack_name}/docker`
        if(!fs.existsSync(docker_folder) || fs.readdirSync(docker_folder).length === 0) continue
        const docker_files = fs.readdirSync(docker_folder)
        docker_template_files[pack_name] = {}
        for(const docker_file of docker_files) {
            const docker_file_path = `${docker_folder}/${docker_file}`
            try {
                docker_template_files[pack_name][docker_file] = {
                    input_file_name: docker_file,
                    content: fs.readFileSync(docker_file_path, 'utf8')
                }
            }
            catch (error) {
                console.error(chalk.red(`Error: Could not read file ${docker_file_path}`))
                continue
            }
        }
    }

    // read all env files
    const env_folder_path = `${cwd.node_modules}/${entry.pack.json.name}/appdata/env`
    const env_file_names = fs.readdirSync(env_folder_path).filter(file => file.endsWith('.env'))
    const envs: {
        path: string // env file path
        vars: ReturnType<typeof prepareEnvVars>
        file: string // env file name including tags and .env extension
        alias: string // env file name without tags
        tag: string // env file tag
        nametag: string // env file name with tag
    }[] = []
    for(const env_file of env_file_names) {
        const env_file_alias = env_file.split('.')[0]
        const env_file_tags = env_file.split('.').slice(1).slice(0, -1)
        const env_file_tag: string = env_file_tags.length > 0? env_file_tags.join('.') : ''
        const env_file_path = `${env_folder_path}/${env_file}`
        const vars = prepareEnvVars(env_file_path)
        envs.push({
            path: env_file_path,
            vars,
            file: env_file,
            alias: env_file_alias,
            tag: env_file_tag,
            nametag: `${env_file_alias}${env_file_tag? `.${env_file_tag}`: ''}`,
        })
    }

    // prepare env_files
    // create global env file named .env
    // create service .${alias}.${env_name}.env
    // create default env file list that includes service file if default option is set to true
    const default_env_files: string[] = []
    const service_env_files: {
        [pack_name: string]: string[]
    } = {}
    const env_files: {
        [env_file_name: string]: string
    } = {
        ".env": `# defaults\nCOMPOSE_PROJECT_NAME=${entry.alias}\n\n`
    }

    for(const env_file of envs) {
        // find module
        const pack = Object.values(packages).find(pack => pack.alias == env_file.alias)
        if(!pack) {
            console.error(chalk.red(`Error: Could not find package for ${env_file.file} via alias ${env_file.alias}`))
            continue
        }
        const env_mod = env_modules.find(mod => mod.key == pack.pack.json.name)
        if(!env_mod) {
            console.error(chalk.red(`Error: Could not find env module for ${pack.pack.json.name}`))
            continue
        }

        for(const [env_key, env_module] of Object.entries(env_mod.mod)) {
            if(env_key == "default") continue
            const env_file_content = `# ${env_mod.key} ${env_key}\n${env_module.toFile(env_module.filter(env_file.vars))}\n\n`
            const service_env_file_name = `.${pack.alias}.${env_key}.env`
        
            if(env_module.options.default) {
                env_files[service_env_file_name] = env_file_content
                default_env_files.push(`"./${service_env_file_name}"`)
            }

            if(env_module.options.service) {
                env_files[service_env_file_name] = env_file_content
                service_env_files[pack.pack.json.name].push(`"./${service_env_file_name}"`)
            }

            env_files[`.env`] = env_files[`.env`] + env_file_content


            const zod = env_module.validate(env_module.filter(env_file.vars))
            if(zod.success === false) {
                console.error(chalk.red(`Validating ${pack.alias}/${env_file.file} with: ${pack.alias}/env.ts:${env_key}:`))
                let errors = zod.error.errors.map((error: any) => `    ${error.path.join('.')}: ${error.message}`)
                console.error(chalk.red(errors.join('\n')))
            }
        }
    }

    // create docker files
    const docker_output_folder = `${appdata}/compose`
    // create output folder if not exists
    fs.existsSync(docker_output_folder) || fs.mkdirSync(docker_output_folder, { recursive:true })
    
    // create env files
    for(const [env_file_name, env_file_content] of Object.entries(env_files)) {
        fs.writeFileSync(`${docker_output_folder}/${env_file_name}`, env_file_content)
    }

    // create docker templates
    for(const env of Object.values(envs)) {
        const pack = Object.values(packages).find(pack => pack.alias == env.alias)
        if(!pack) {
            console.error(chalk.red(`Error: Could not find package for ${env.file} via alias ${env.alias}`))
            continue
        }
        const docker_files = docker_template_files[pack.pack.json.name]
        if(!docker_files) {
            // console.error(chalk.red(`Error: Could not find docker files for ${pack.pack.json.name}`))
            continue
        }
        const compose_global = docker_files["compose.global.yml"]
        const dockerfile_global = docker_files["Dockerfile.global"]

        const root_full_path = cwd.workspace || cwd.typestack
        if(!root_full_path) throw new Error("Missing root_full_path")
        const root_path = path.relative(docker_output_folder, root_full_path)
        const appdata_path = path.relative(docker_output_folder, appdata)
        const vars = {
            ...env.vars,
            "@ROOT": root_path, // root folder of the project
            "@ALIAS": pack.alias, // alias of package, used as env file first part
            "@TAG":env.tag, // env file tags, all after first dot in env file name
            "@NAMETAG": env.nametag, // combined alias and tag, used as env file name
            "@PACKAGE": `${root_path}/node_modules/${pack.pack.json.name}`, // full path to package
            "@DEFAULT": `[${default_env_files?.join(', ')}]`, // all package default env files
            "@VERSION": pack.pack.json.version, // package version
            "@SERVICE": `[${service_env_files[pack.pack.json.name]?.join(', ')}]`, // docker package service env files
            "@APPDATA": `${appdata_path}/docker/${pack.alias}`, // appdata folder for docker package
            "@HOSTNAME": getHost(),
            "@COMPOSE_PROJECT_NAME": entry.alias, // compose project name
        }

        function getOutputFileName(input_file_name: string, keys: string[]) {
            // split input file name by .
            const file_parts = input_file_name.split('.')
            // push extra keys into second position
            file_parts.splice(1, 0, ...keys)
            // join file parts by .
            return file_parts.join('.')
        }

        for(const [i, file] of Object.entries(docker_files)) {
            if(!file) {
                console.error(chalk.red(`Error: Could not find docker file for ${pack.pack.json.name}`))
                continue
            }
            if(file.input_file_name.startsWith("compose.global.yml")) continue // skip global compose file
            const output_file_path = `${docker_output_folder}/${getOutputFileName(file.input_file_name, [vars['@NAMETAG']])}`
            const input_file_path = `${cwd.node_modules}/${pack.pack.json.name}/docker/${file.input_file_name}`
            let global_content: string | Buffer | undefined = undefined
            if(file.input_file_name.startsWith("Dockerfile")) {
                global_content = dockerfile_global?.content
            } else if (file.input_file_name.startsWith("compose")) {
                global_content = compose_global?.content
            }
            prepareDockerFile(global_content, vars, input_file_path, output_file_path, `${pack.pack.json.name}/${env.file}`)
        }
    }

    // -------------------- CERTBOT --------------------
    // copy from core package to appdata certbot config
    const certbot_output_folder = `${appdata}/certbot`
    const layout = fs.readFileSync(`${cwd.node_modules}/@ts.app/core/static/certbot.nginx.tpl.conf`, 'utf8')
    // create output folder if not exists
    !fs.existsSync(certbot_output_folder) && fs.mkdirSync(certbot_output_folder, { recursive:true })
    fs.writeFileSync(`${certbot_output_folder}/nginx.conf`, layout)

    // -------------------- HAPROXY --------------------
    // create haproxy
    const haproxy_output_file_content: {[key: string]: string} = {}

    // foreach env file
    for(const env of Object.values(envs)) {
        const pack = Object.values(packages).find(pack => pack.alias == env.alias)
        if(!pack) {
            console.error(chalk.red(`Error: Could not find package for ${env.file} via alias ${env.alias}`))
            continue
        }

        // skip if pack.haproxy.rewrite is false
        const haproxy_input_folder = `${cwd.node_modules}/${pack.pack.json.name}/haproxy/`        
        // check if directory is empty and exists
        if(!fs.existsSync(haproxy_input_folder) || fs.readdirSync(haproxy_input_folder).length === 0) continue

        const haproxy_input_files = fs.readdirSync(haproxy_input_folder)

        const appdata_path = path.relative(haproxy_input_folder, appdata)
        const root_full_path = cwd.workspace || cwd.typestack
        if(!root_full_path) throw new Error("Missing root_full_path")
        const root_path = path.relative(haproxy_input_folder, root_full_path)
        const vars = {
            ...env.vars,
            "@ROOT": root_path, // root folder of the project
            "@ALIAS": pack.alias, // alias of package, used as env file first part
            "@TAG":env.tag, // env file tags, all after first dot in env file name
            "@NAMETAG": env.nametag, // combined alias and tag, used as env file name
            "@PACKAGE": `${root_path}/node_modules/${pack.pack.json.name}`, // full path to package
            "@DEFAULT": `[${default_env_files?.join(', ')}]`, // all package default env files
            "@VERSION": pack.pack.json.version, // package version
            "@SERVICE": `[${service_env_files[pack.pack.json.name]?.join(', ')}]`, // docker package service env files
            "@APPDATA": `${appdata_path}/docker/${pack.alias}`, // appdata folder for docker package
            "@HOSTNAME": getHost(),
            "@COMPOSE_PROJECT_NAME": entry.alias, // compose project name
        }

        if(pack.options.haproxy_defaults && haproxy_output_file_content['defaults']) {
            for(const tpl of pack.options.haproxy_defaults) {
                haproxy_output_file_content['defaults'] += `${templateReplace(tpl, vars, 'defaults.cfg', `${pack.pack.json.name}/${env.file}`)}\n`
                // console.log(chalk.green(`Added ${tpl} to defaults.cfg`))
            }
        }

        for(const haproxy_input_file of haproxy_input_files) {
            const haproxy_input_file_path = `${haproxy_input_folder}/${haproxy_input_file}`
            const file_names = haproxy_input_file.split('.').slice(0, -1)

            let file_name = `${file_names[0]} ${vars['@NAMETAG']}.${file_names.slice(1).join('.')}`
            if(!file_names.slice(1).join('.')) {
                file_name = `${file_names[0]}`
            }

            if(!fs.existsSync(haproxy_input_file_path)) {
                console.error(chalk.red(`Error:\t File ${haproxy_input_file_path} does not exist`))
                continue
            }

            const file_content = fs.readFileSync(haproxy_input_file_path, 'utf8')
            if(pack.options.haproxy_rewrite || !haproxy_output_file_content[file_name]) {
                const template = "# " + pack.pack.json.name + ", " + file_name + "\n" + file_content + "\n"
                haproxy_output_file_content[file_name] = templateReplace(template, vars, haproxy_input_file, `${pack.pack.json.name}/${env.file}`)
            }else {
                console.error(chalk.red(`Error:\t File ${haproxy_input_file_path} already exists in output file ${file_name}, skipping rewrite`))
            }
        }
    }

    // write haproxy file
    let haproxy_output_content = ""
    const haproxy_output_folder = `${appdata}/haproxy`
    const haproxy_output_file = `${haproxy_output_folder}/proxy.cfg`
    const haproxy_order = ["resolvers", "global", "defaults", "frontend", "backend", "userlist"]
    const haproxy_output_content_order: {file_name: string, content: string}[] = []
    for(const file_name of haproxy_order) {
        for(const [key, content] of Object.entries(haproxy_output_file_content)) {
            if(key.includes(file_name)) {
                haproxy_output_content_order.push({
                    file_name: key, 
                    content: content.split("\n").map(line => "\t" + line).join("\n")
                })
            }
        }
    }
    for(const content of haproxy_output_content_order) {
        haproxy_output_content += content.file_name + "\n" + content.content + "\n"
    }
    // create output folder if not exists
    !fs.existsSync(haproxy_output_folder) && fs.mkdirSync(haproxy_output_folder, { recursive:true })
    fs.writeFileSync(haproxy_output_file, haproxy_output_content)


    // ------------------- NEXT -------------------
    const next_output_dir = `${appdata}/next`
    const next_admin_path = `app/admin/[[...app]]`

    // remove next build folder
    // const next_build_folder = `${next_output_dir}/.next`
    // if(fs.existsSync(next_build_folder)) {
    //     console.warn(chalk.yellow(`Removing next build folder: ${next_build_folder}`))
    //     fs.rmdirSync(next_build_folder, { recursive:true })
    // }

    // create output_dir/app
    if(!fs.existsSync(`${next_output_dir}/app`) && link) fs.mkdirSync(`${next_output_dir}/app`, { recursive:true })
    // create output_dir/public
    if(!fs.existsSync(`${next_output_dir}/public`) && link) fs.mkdirSync(`${next_output_dir}/public`, { recursive:true })
    // empty `${output_dir}/app` and `${output_dir}/public`
    if(fs.existsSync(`${next_output_dir}/app`) && link) emptyDir(`${next_output_dir}/app`)
    if(fs.existsSync(`${next_output_dir}/public`) && link) emptyDir(`${next_output_dir}/public`)
    if(link && fs.existsSync(`${next_output_dir}/app`)) unlinkFolder(`${next_output_dir}/app`)

    for(const [pack_key, pack] of Object.entries(packages)) {
        const output_app_dir = getSymLink(`${next_output_dir}/app/${pack.alias}`)
        const output_public_dir = getSymLink(`${next_output_dir}/public/${pack.pack.json.name}`)
        const app_dir = `${cwd.node_modules}/${pack.pack.json.name}/next/app/`
        const public_dir = `${cwd.node_modules}/${pack.pack.json.name}/next/public/`

        try {
            // skip if next_dir does not exist
            if(!fs.existsSync(app_dir)) continue
            
            if(pack.options.next_disable_alias == true) {
                if(link) linkFolder(app_dir, `${next_output_dir}/app/`)
            }else {
                if(link) linkFolder(app_dir, output_app_dir.symlink_path)
            }

            // skip if public_dir does not exist
            if(!fs.existsSync(public_dir)) continue
            
            // create public symlink
            if(link && !fs.existsSync(output_public_dir.path_to_create)) mkDirRecursive(output_public_dir.path_to_create)
            if(link && fs.existsSync(output_public_dir.symlink_path)) fs.unlinkSync(output_public_dir.symlink_path)
            if(link) fs.symlinkSync(public_dir, output_public_dir.symlink_path, 'dir')
        } catch (error) {
            console.error(chalk.red(`Error while linking ${app_dir} to ${output_app_dir.symlink_path} error: ${error}`))
        }
    }

    // if layout.tsx does not exist create it
    if(fs.existsSync(`${next_output_dir}/app/`) && !fs.existsSync(`${next_output_dir}/app/layout.tsx`)) {
        const layout = fs.readFileSync(`${cwd.node_modules}/@ts.app/core/static/next.layout.tpl.tsx`, 'utf8')
        fs.writeFileSync(`${next_output_dir}/app/layout.tsx`, layout)
    }
    
    // if next.tsconfig.json does not exist create it
    if(fs.existsSync(`${next_output_dir}/app/`) && !fs.existsSync(`${next_output_dir}/app/next.tsconfig.json`)) {
        const tsconfig = fs.readFileSync(`${cwd.node_modules}/@ts.app/core/static/next.tsconfig.tpl.json`, 'utf8')
        fs.writeFileSync(`${next_output_dir}/next.tsconfig.json`, tsconfig)
    }

    // if next.config.js does not exist create it
    if(fs.existsSync(`${next_output_dir}/app/`) && !fs.existsSync(`${next_output_dir}/app/next.config.js`)) {
        const next_config = fs.readFileSync(`${cwd.node_modules}/@ts.app/core/static/next.config.tpl.js`, 'utf8')
        fs.writeFileSync(`${next_output_dir}/next.config.js`, next_config)
    }

    // if /${next_admin_path} does not exist create it
    if(!fs.existsSync(`${next_output_dir}/${next_admin_path}`)) {
        fs.mkdirSync(`${next_output_dir}/${next_admin_path}`, { recursive:true })
    }

    // create layout.tsx    
    if(fs.existsSync(`${next_output_dir}/${next_admin_path}`)) {
        const layout = fs.readFileSync(`${cwd.node_modules}/@ts.app/core/static/next.admin.layout.tpl.tsx`, 'utf8')
        fs.writeFileSync(`${next_output_dir}/${next_admin_path}/layout.tsx`, layout.replaceAll('${@PACKAGE}', entry.pack.json.name))
    }

    // create page.tsx
    if(fs.existsSync(`${next_output_dir}/${next_admin_path}`)) {
        const page = fs.readFileSync(`${cwd.node_modules}/@ts.app/core/static/next.admin.page.tpl.tsx`, 'utf8')
        fs.writeFileSync(`${next_output_dir}/${next_admin_path}/page.tsx`, page)
    }

    // ------------------- NEXT APPS -------------------
    const next_apps_output_file = `${cwd.typestack}/next/apps.tsx`
    const next_apps_config: AppConfigInput[] = []
    for (const [pack_key, pack] of Object.entries(packages)) {
        // check if access file exists
        if(!fs.existsSync(`${cwd.node_modules}/${pack.pack.json.name}/dist/esm/configs/access.js`)) continue
        const _config = (await import(`${pack.pack.json.name}/configs/access.js`)).default

        // loop trough each resource
        for (const [resource_key, _resource] of Object.entries<any>(_config)) {
            // loop trough each action
            for (const [action_key, _action] of Object.entries<any>(_resource)) {
                if(_action.admin) next_apps_config.push({
                    alias: pack.alias,
                    pack: pack.pack.json.name,
                    resource: resource_key,
                    action: action_key,
                    admin: {
                        hash: generateHash(pack.pack.json.name+"_"+resource_key+"_"+action_key),
                        app: _action.admin.app,
                        iframe: _action.admin.iframe,
                        title: _action.admin.title || action_key,
                        icon: _action.admin.icon
                    }
                })
            }
        }
    }

    // create self apps.tsx file
    fs.writeFileSync(next_apps_output_file, getAdminAppsFile(next_apps_config))


    // ------------------- GRAPHQL -------------------
    //WRITE core/codegen/next/graphql.tsx
    const getGraphqlConfig = function (uri: string, isPublic: boolean) {
        return `
            new ApolloClient({
                cache: new InMemoryCache(),
                link: setContext(async (_, { headers }) => {
                    if(${isPublic}){
                        return headers
                    } else {
                        const auth_headers = await tsc.getAuthHeaders()
                        return {
                            headers: {
                                ...headers,
                                ...auth_headers,
                            }
                        }
                    }
                }).concat(createHttpLink({
                    uri: "${uri}" // "https://localhost:7443/graphql/@ts.app/core/system/"
                }))
            })
        `
    }

    const graphql_file = `
        import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
        import { setContext } from '@apollo/client/link/context'
        import TSAppClient from "@ts.app/core/models/user/app/oauth/client/tsapp.js"
        export function getGraphqlClients(tsc: TSAppClient) {
            return {
                {services}
            }
        }

        export type GraphqlClients = ReturnType<typeof getGraphqlClients>
    `
    for(const [pack_key, pack] of Object.entries(packages)) {
        if(!fs.existsSync(`${cwd.node_modules}/${pack.pack.json.name}/dist/esm/configs/graphql.js`)) continue
        const graphql = (await import(`${pack.pack.json.name}/configs/graphql.js`)).default
        if(!graphql || Object.keys(graphql).length === 0) continue

        let graphql_services = ''

        for(const [service_key, service] of Object.entries(graphql) as any) {
            if(!service.isServer) continue
            graphql_services = `${graphql_services}
                "${service_key}": ${getGraphqlConfig(`/graphql/${pack.pack.json.name}/${service_key}/`, service.isPublic)},
            `
        }

        // create folder if not exists
        !fs.existsSync(`${cwd.node_modules}/${pack.pack.json.name}/codegen`) && fs.mkdirSync(`${cwd.node_modules}/${pack.pack.json.name}/codegen`, { recursive:true })
        fs.writeFileSync(`${cwd.node_modules}/${pack.pack.json.name}/codegen/graphql.ts`, graphql_file.replace('{services}', graphql_services))
    }
}