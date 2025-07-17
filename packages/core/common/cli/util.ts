import fs from 'fs'
import path from 'path'
import merge from 'lodash.merge'
import * as crypto from 'crypto'
import { IAccessOptions, IAccessOptionsInput } from '@ts.app/core'
import { TypeStackConfig, CWD, GraphqlServerInput, GraphqlServerOutput, TypeStack, TypeStackPackage, ConfigInput } from '@ts.app/core/common/cli/typestack.js'

type Packages = string
type GraphqlResovlerModule = any
type GraphqlRouter<T> = any
type IGraphqlRouter = any

export type DefaultOptions = {
    cwd: CWD
    argv: typeof process.argv
}

export async function getPackageConfigs(pak: TypeStackPackage) {
    let graphql: { [key: string]: GraphqlServerInput } | undefined = undefined
    try {
        // import graphql configs
        graphql = cloneObject((await import(`${pak.pack.json.name}/configs/graphql.js`)).default)
    } catch (error) {
        //console.log(`Could not import graphql configs for ${dep_key}`)
    }
    return {
        ...pak,
        graphql
    }
}

export function extractArg(args: any, arg_name: string, required: boolean) {
    const arg_value = args[arg_name]
    if(!arg_value && required){
        throw new Error(`Start server argument ${arg_name} is required`)
    }
    return arg_value
}

type Meybe <T> = T | undefined | null

export function getDefaultOpts(options: IAccessOptionsInput, pack: string, resource: string, action: string) {

    function isEnabled<T extends Meybe<{ enabled?: Meybe<boolean> }>>(input: T, overwrite?: Meybe<boolean>): boolean | undefined {
        if (typeof overwrite === 'boolean') return overwrite;
        if (input == null) return undefined;
        if (Array.isArray(input)) return undefined;
        if (Object.keys(input).length === 0) return undefined;
        return true;
    }


    function getDefault<T extends { enabled?: Meybe<boolean> } | null | undefined, Z extends {}>(input: T, defaults: Z) {
        if (input == null) return undefined;

        const enabled = isEnabled(input, input.enabled);
        if (enabled == undefined) return undefined;

        return {
            ...input,
            ...defaults,
            enabled,
        };
    }

    return {
        ...options,
        enabled: options?.enabled != undefined ? options.enabled : true,
        pack,
        resource,
        action,
        resourceAction: `${resource}_${action}`,
        auth: getDefault(options.auth, {}),
        limit: getDefault(options.limit, {
            limitInterval: options.limit?.limitInterval || '1m',
            limitTreshold: options.limit?.limitTreshold || 500,
        }),
        log: getDefault({
            ...options?.log,
            enabled: options?.log?.enabled != undefined ? options.log.enabled : true,
        }, {}) || { enabled: true },
        model: getDefault(options.model, {}),
        captcha: getDefault(options.captcha, {}),
        admin: getDefault(options.admin, {
            title: `${pack} ${resource} ${action}`,
            hash: generateHash(pack+"_"+resource+"_"+action)
        }) satisfies IAccessOptions['admin'],
    } satisfies IAccessOptions
}

export function getAccessDefaults(pack: string, access: ConfigInput['access'] | undefined): ConfigInput['access'] | undefined {
    const _config = JSON.parse(JSON.stringify(access)) as ConfigInput['access']

    // if empty object
    if(!_config || Object.keys(_config).length == 0) return _config

    for(const resource_key of Object.keys(_config) ) {
        const resource = _config[resource_key]
        for(const action_key of Object.keys(resource) ) {
            const action = resource[action_key]
            _config[resource_key][action_key] = getDefaultOpts(_config[resource_key][action_key], pack, resource_key, action_key)
        }
    }
    return _config
}

export function copyConfigs(src_folder: string, dest_folder: string) {
    const files = fs.readdirSync(src_folder)

    // create destination folder if not exist
    !fs.existsSync(dest_folder) && fs.mkdirSync(dest_folder, { recursive:true }) 

    for(const file_name of files) {
        const src_file = src_folder+file_name;
        const dst_file = dest_folder+file_name;
        // remove file if exists
        fs.existsSync(dst_file) && fs.unlinkSync(dst_file)
        // copy file
        fs.copyFileSync(src_file, dst_file)
    }
}

export function writePublicFile(dest_file: string, content: any) {
    const file_content = JSON.stringify(content, null, 4)
    const file_path = dest_file.replace('.json', '.public.json')
    fs.writeFileSync(file_path, file_content)
    writeJsonTypeFile(file_path)
}

export function writeJsonTypeFile(dest_file: string) {
    const file_content = `export type T = ${fs.readFileSync(dest_file, 'utf8')}`
    const file_path = dest_file.replace('.json', '.ts')
    fs.writeFileSync(file_path, file_content)
}

export function addDefaultValues(obj: any, filename: string, pack: string) {
    
    if(filename == "captcha.json") {
        if(obj){
            for(let key in obj){
                obj[key] = {
                    ...obj[key],
                    type: key
                }
            }
        }
    }

    if(filename == "graphql.json") {
        if(obj){
            for(let key in obj){
                obj[key] = {
                    ...obj[key],
                    serverPath: `/graphql/${pack}/${key}`
                }
            }
        }
    }

    if(filename == "access.json") {
        const set_defaults = (_config: any) => {
            // if empty object
            if(Object.keys(_config).length == 0 || !_config) return _config
    
            for(const resource_key of Object.keys(_config) ) {
                const resource = _config[resource_key]
                for(const action_key of Object.keys(resource) ) {
                    const action = resource[action_key]
                    _config[resource_key][action_key] = getDefaultOpts(_config[resource_key][action_key], pack, resource_key, action_key)
                }
            }
            return _config
        }

        set_defaults(obj)
    }

    return obj
}

export function emptyDir(dir: string){
    for (const file of fs.readdirSync(dir)) {
        const curPath = path.join(dir, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
            emptyDir(curPath);
        } else { // delete file
            fs.unlinkSync(curPath);
        }
    }
}


export async function getGraphqlRouterConfigs(configs: TypeStackConfig) {
    const _server: GraphqlServerOutput[] = []
    for(const [pack_name, pack] of Object.entries(configs.packages)) {
        const graphql = (await getPackageConfigs(pack)).graphql
        if(!graphql) continue
        for(const [server_key, server] of Object.entries(graphql)) {
            const srv_input: Partial<GraphqlServerInput> = server
            const srv = {
                name: server_key,
                pack: pack_name as Packages,
                typeDefPath: `${configs.cwd.node_modules}/${pack_name}/codegen/${server_key}/index.ts`,
                clientPath: `${configs.cwd.node_modules}/${pack_name}/codegen/${server_key}/client/`,
                serverPath: `/graphql/${pack_name}/${server_key}`,
                
                isPublic: srv_input?.isPublic || false,
                isServer: srv_input?.isServer || false,
                genClient: srv_input?.genClient || false,
                modules: srv_input?.modules || [],
                documents: srv_input?.documents || [],
            } satisfies GraphqlServerOutput

            // foreach document add path
            for(let i = 0; i < srv.documents.length; i++) {
                srv.documents[i] = `${configs.cwd.node_modules}/${srv.documents[i]}`
            }

            //foreach schema add path
            for(let i = 0; i < srv.modules.length; i++) {
                srv.modules[i] = `${configs.cwd.node_modules}/${srv.modules[i]}`
            }

            _server.push(srv)
        }
    }

    return _server
}

export async function createGraphqlResovlerFile(configs: TypeStackConfig) {
    const core_dir = `${configs.cwd.typestack}/codegen`
    // create codegen/graphql/reosolvers.json file
    const resolvers_output = `${core_dir}/resolvers.json`
    const resolvers: string[] = []

    // create codegen/graphql folder if not exist
    if (!fs.existsSync(core_dir)) fs.mkdirSync(core_dir, { recursive: true })
    
    // create empty resolvers file if not exist
    if(!fs.existsSync(resolvers_output)) fs.writeFileSync(resolvers_output, JSON.stringify([], null, 2), 'utf8')

    try {
        for (const graphql_server of await getGraphqlRouterConfigs(configs)) {
            // check if typeDefPath exists
            if(!fs.existsSync(graphql_server.typeDefPath)) continue

            let file_result = fs.readFileSync(graphql_server.typeDefPath, 'utf8')
            // extract IResolvers type keys from file_result: 
                // export type IResolvers<ContextType = any> = {
                //   AccessDocument?: IAccessDocumentResolvers<ContextType>;
                //   AccessInput?: IAccessInputResolvers<ContextType>;
            // resolvers should be ["AccessDocument", "AccessInput", ...]
            const regex = /export type IResolvers<ContextType = any> = {([^}]+)}/
            const match = file_result.match(regex)
            if(match){
                const resolvers_str = match[1]
                const resolvers_regex = /([A-Za-z]+)\?:/g
                let resolvers_match
                while ((resolvers_match = resolvers_regex.exec(resolvers_str)) !== null) {
                    resolvers.push(resolvers_match[1])
                }
            }
        }
    } catch (error) {
        console.error(error)
    }

    fs.writeFileSync(resolvers_output, JSON.stringify(resolvers, null, 2), 'utf8')
}

export function getGraphqlResolverKeys() {
    const cwd = TypeStack.findCWD()
    const core_dir = `${cwd.typestack}/codegen`
    const resolvers_output = `${core_dir}/resolvers.json`
    let resolvers: string[] = []

    if(fs.existsSync(resolvers_output)) {
        resolvers = JSON.parse(fs.readFileSync(resolvers_output, 'utf8'))
    }

    return resolvers
}

export type GetGraphqlModulesOptions = { 
    schema: boolean
    resolvers: boolean
}

// Recursively process all graphql schema files in the given directories
export async function getGraphqlModules(config: GraphqlServerOutput, options: GetGraphqlModulesOptions, directories: string[] | undefined = undefined) {
    let schema: string = ""
    let resolvers: GraphqlResovlerModule = {}
    let routers: IGraphqlRouter[] = []

    if(!directories) directories = config.modules as string[]

    for(const directory of directories) {
        // Read all files and directories from the current directory
        const files = fs.readdirSync(directory);
        for(const file of files) {
            const filePath = path.join(directory, file);
    
            // Check if it's a directory
            if (fs.statSync(filePath).isDirectory()) {
                // Recursive call to process files in nested directories
                const _module = await getGraphqlModules(config, options, [filePath])
                schema += _module.schema
                resolvers = merge(resolvers, _module.resolvers)
                routers.push(..._module.routers)
            }else {
                // use .js files only
                if(file.split(".").pop() != "js")
                    continue

                // if options.resolvers is true
                // and file ends with .resolver.js
                if(file.endsWith("resolver.js") && options.resolvers) {
                    console.log(`Loading resolvers: ${filePath}`)
                    const graphql_module = await import(filePath).then((module) => module) as any

                    // as GraphqlRouter<any> | undefined
                    if(graphql_module && Object.keys(graphql_module).length > 0) {
                        for(const [key, graphql_router] of Object.entries<GraphqlRouter<any> | undefined | string>(graphql_module)) {
                            // if module has default export and it's an object
                            if(graphql_router && typeof graphql_router != "string" && graphql_router.resolvers) {
                                resolvers = merge(resolvers, graphql_router.getResolvers())
                                routers.push(...graphql_router.getRouters(config))
                            }
                        }
                    }
                }
                
                // if options.schema is true
                // and file ends with .schema.js
                if(file.endsWith("schema.js") && options.schema) {
                    console.log(`Loading schema: ${filePath}`)

                    const _schema_module = await import(filePath).then((module) => module)

                    if(_schema_module?.default && typeof _schema_module?.default === 'string' && _schema_module.default.startsWith("#graphql"))
                        schema += _schema_module.default

                    for(const [key, value] of Object.entries(_schema_module)) {
                        if(key === 'default') continue
                        if(value && typeof value === 'string' && value.startsWith("#graphql")) {
                            schema += value
                        }
                    }
                }
            }
        }
    }

    return {schema, resolvers, routers}
}

export function prepareEnvVars(env_path: string) {
    const env_file = fs.readFileSync(env_path)
    let env_vars: { [ key: string ]: string } = {}
    // split env file into array
    const env_array = env_file.toString().split("\n")

    // loop through array and update env variables
    for(let i = 0; i < env_array.length; i++){
        const env_var = env_array[i].split("=")
        if(!env_var[1]) continue

        // remove all starting and ending spaces from env var name
        const env_var_name = env_var[0].replace(/\t|\s/g, "").replace("#", "")

        // remove all starting and ending spaces from env var value and remove all " characters
        var env_var_value_tmp = env_var[1].replace(/^\s+|\s+$/g, "").replace(/"/g, "")
        // remove all content after # sign
        env_var_value_tmp = env_var_value_tmp.split("#")[0]
        // trim spaces from env var value
        env_var_value_tmp = env_var_value_tmp.trim()
        // trim ' and  " qoutes from env var value
        env_var_value_tmp = env_var_value_tmp.replace(/^['"]|['"]$/g, "")
        const env_var_value = env_var_value_tmp

        env_vars[env_var_name] = env_var_value
        if(!env_var_value || !env_var_name) continue
        env_vars[env_var_name] = env_var_value
        // console.log(env_var_name + "=" + env_var_value)
    }

    // foreach env var replace ${var} with value
    for(const [key, value] of Object.entries(env_vars)) {
        env_vars[key] = value.replace(/\$\{([^}]*)\}/g, function(match, name) {
            if(!env_vars[name]) {
                console.log(`Error, missing env var: ${name}`)
                return ''
            }
            return env_vars[name]
        })
    }

    return env_vars
}

export function prepareDockerFile(global_compose_file: Buffer | string | undefined, env_vars: any, file: string, output: string, env_name: string) {
    // read compose file
    let docker_compose_file = fs.readFileSync(file).toString() 
    // add global compose file to docker_compose_file with new line
    docker_compose_file = (global_compose_file || "") + "\r" + docker_compose_file
    // replace file env variables
    const docker_compose_file_new = templateReplace(docker_compose_file, env_vars, file, env_name)
    fs.writeFileSync(output, docker_compose_file_new)
}

export function templateReplace(template: string, env_vars: any, file: string, env_name: string) {
    return template.replace(/(\$*)\$\{([^}]+)\}/g, function(match, dollars, name) {
        if (dollars.length === 1) {
            // Escaped variable, reduce $$ to single $
            return dollars.slice(0, dollars.length - 1) + `\${${name}}`
        }
    
        const replace_with = env_vars[name]
        if(replace_with == undefined) {
            console.warn(`Missing env: ${env_name}, var: ${name}, in: ${file.split('/').pop()}`)
            return ''
        }
        return replace_with
    })
}

export async function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

export function mkDirRecursive(dir: string) {
    if (!fs.existsSync(dir)) {
        const dirs = dir.split('/')
        let _dir = ''
        for(const d of dirs) {
            _dir += d + '/'
            if (!fs.existsSync(_dir)){
                fs.mkdirSync(_dir)
            }
        }
    }
}

export function cloneObject<T = any>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}


export function linkFolder(source: string, target: string) {
    // use fs.linkSync to lin each file in source to target

    // if target dosent exist create it
    if(!fs.existsSync(target)) mkDirRecursive(target)

    // foreach file in source
    for(const file_name of fs.readdirSync(source)) {
        const source_file = `${source}/${file_name}`
        const target_file = `${target}/${file_name}`

        // if file is a folder
        if(fs.lstatSync(source_file).isDirectory()) {
            // if target folder dosent exist create it
            if(!fs.existsSync(target_file)) mkDirRecursive(target_file)
            // link folder
            linkFolder(source_file, target_file)
        }else {
            // if target file dosent exist create it
            if(!fs.existsSync(target_file)) {
                fs.symlinkSync(source_file, target_file)
            }else {
                console.warn(`File ${target_file} already exists`)
            }
        }
    }
}

export function unlinkFolder(target: string) {
    // unlink all files in target

    // foreach file in target
    for(const file_name of fs.readdirSync(target)) {
        if(fs.lstatSync(`${target}/${file_name}`).isDirectory()) {
            // unlink folder
            unlinkFolder(`${target}/${file_name}`)
        } else {
            // unlink file
            fs.unlinkSync(`${target}/${file_name}`)
        }
    }
}

export function getSymLink(path: string) {
    // path all upto last /
    let path_to_create = path.split('/').slice(0, -1).join('/')
    // remove last /
    let symlink_path = path.replace(/\/$/, '/')

    return {
        path_to_create,
        symlink_path
    }
}

export function copyRecursiveSync(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src);

    for (const entry of entries) {
        try {
            const srcPath = path.join(src, entry);
            const destPath = path.join(dest, entry);
            const stat = fs.statSync(srcPath);
    
            if (stat.isDirectory()) {
                // Recursively copy directories
                copyRecursiveSync(srcPath, destPath);
            } else {
                // Copy files
                fs.copyFileSync(srcPath, destPath);
            }
        } catch (error) {
            console.error(`Error backing up file: ${src}/${entry}`)
        }
    }
}

export function generateHash(str: string) {
    const hash = crypto.createHash('sha256')
    hash.update(str);
    return hash.digest('hex')
}


export interface AppConfigInput {
    alias: string
    pack: string
    resource: string
    action: string
    admin: {
        app?: string
        iframe?: string
        title: string
        icon?: string
        hash: string

    }
}

export function getAdminAppConfig(app: AppConfigInput) {
    if(!app.admin === undefined) {
        throw new Error(`Missing admin config for ${app.pack}.${app.resource}.${app.action}`)
    }

    let alias = app.alias

    if(typeof app.alias === "string") {
        alias = `"${app.alias}"`
    }

    if(app.alias === undefined) {
        alias = "undefined"
    }

    if(app.alias === null) {
        alias = "null"
    }

    const _app = (!app.admin.app) ? 'undefined' : [
        `dynamic(() => import("${app.admin.app}"), {`,
        `            ssr: false,`,
        `            loading: () => <p>loading...</p>`,
        `        })`
    ].join('\n');
      
    return [
        `{`,
        `    alias: ${alias},`,
        `    pack: "${app.pack}",`,
        `    resource: "${app.resource}",`,
        `    action: "${app.action}",`,
        `    admin: {`,
        `        hash: "${app.admin.hash}",`,
        `        app: ${_app},`,
        `        iframe: ${app.admin.iframe ? `"${app.admin.iframe}"` : "undefined"},`,
        `        title: "${app.admin.title}",`,
        `        icon: ${app.admin.icon ? `"${app.admin.icon}"` : "undefined"}`,
        `    }`,
        `}`
    ].join('\n');
}

export function getAdminAppsFile(apps_config: AppConfigInput[]) {
    return [
        `// DO NOT EDIT THIS FILE!`,
        `// This file is auto generated by 'ts config' cli command`,
        `import React from 'react'`,
        `import dynamic from 'next/dynamic'`,
        `export const apps = [${apps_config.map(getAdminAppConfig).join(',')}]`
    ].join('\n')
}