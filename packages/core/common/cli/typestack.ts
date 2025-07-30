import fs from 'fs'
import { ConfigInput, ConfigOutput } from '@ts.app/core/common/cli/typedefs.js'
import type { NonUndefined } from 'utility-types'
import type { DBConnectionOutput } from '@ts.app/core/common/db.js'
import type { RMQConnectionOutput } from '@ts.app/core/common/rabbitmq/connection.js'
import type { JobList } from '@ts.app/core/common/job.js'
// import type { IAccessOptions } from "@ts.app/core/codegen/admin/index.js"

import { tsapp } from "@ts.app/core/configs/env.js"
import { getAccessDefaults, getPackageConfigs } from '@ts.app/core/common/cli/util.js'
import { ExpressRouter, GraphqlRouter } from '@ts.app/core/common/service.js'
import { PackageJson } from '@ts.app/core/common/cli/typedefs.js'
import DB from '@ts.app/core/common/db.js'

export * from '@ts.app/core/common/cli/typedefs.js'

import { createRequire } from "module"
import { fileURLToPath } from 'url'

export type TypeStackOptions = {
    enabled: boolean // is package enabled
    haproxy_rewrite: boolean
    haproxy_defaults?: string[]
    next_disable_alias: boolean
}

export const defaultTypeStackOptions: TypeStackOptions = {
    enabled: true,
    haproxy_rewrite: false,
    next_disable_alias: false
}

export type InitOptions = {
    start_jobs?: boolean
    start_rmq_consumers?: boolean
    config?: TypeStackConfig
}

export const defaultInitOptions: InitOptions = {
    start_jobs: false,
    start_rmq_consumers: false
}

export class Package<Json extends PackageJson = PackageJson, Config extends ConfigInput = ConfigInput> {
    json: Json
    options: TypeStackOptions
    _config: Config
    _db?: DBConnectionOutput<Config>
    _rmq?: RMQConnectionOutput<Config>
    _filename: string

    constructor(json: Json, config: Config, options:Partial<TypeStackOptions> = {}) {
        this.json = json
        this._config = config
        this.options = { ...defaultTypeStackOptions, ...options }
        this._filename = fileURLToPath(import.meta.url);
    }

    async init(opts: InitOptions = defaultInitOptions) {
        this._db = await new DB<Config>().getInstance(this)
        // this._rmq = await new RMQConnections<Config>().getInstance(opts.start_rmq_consumers)
    }
    
    get config () {
        return this._config as unknown as ConfigOutput<Config>
    }

    get db(): DBConnectionOutput<Config> {
        // if sub packages are using core or any ts package with different version than entrypoint it will have different context that has not been initilized.
        // for now we assume that all packages are compatible with the entrypoints version and we borrow entrypoint package db connection.
        // TODO there should be version and compatibility check for all packages while running ts config cli command.
            //  - major versions and db config changes could indicate breaking changes
        if(!this._db) {
            this._db = TypeStack.config.packages[this.json.name].pack.db as DBConnectionOutput<Config>
        }

        if(!this._db || Object.keys(this._db).length === 0) {
            throw new Error(`DB not initilized`)
        }
        
        return this._db
    }

    get rmq() {
        if(!this._rmq) {
            throw new Error(`RMQ not initilized`)
        }
        return this._rmq
    }

//     private static _init: Promise<void>
//     private static _db: DBConnections
//     private static _rmq: RMQConnections
//     private static _jobs: JobList

//     static async init(options?: {
//         start_rmq_consumers?: boolean
//         start_jobs?: boolean
//     }) {
//         if(TS._init) return TS._init
//         return TS._init = new Promise(async (resolve, reject) => {
//             const DB = (await import("@ts.app/core/common/db.js")).default
//             TS._db = await DB.getInstance()

//             const ModelLoader = (await import('@ts.app/core/common/model.js')).ModelLoader
//             const { ConnectionList } = await import("@ts.app/core/common/rabbitmq/connection.js")
//             const JobList = (await import('@ts.app/core/common/job.js')).JobList

//             await ModelLoader.loadAllModels()
//             TS._rmq = await ConnectionList.initilize(options?.start_rmq_consumers)
//             TS._jobs = await JobList.getInstance(options?.start_jobs)

//             resolve()
//         })
//     }

    // static get rmq(): RMQConnections {
    //     return TS._rmq
    // }

    // static get db(): DBConnections {
    //     return TS._db
    // }

    // static get jobs(): JobList {
    //     return TS._jobs
    // }

    // static get router() {
    //     return {
    //         graphql: <T>() => {
    //             return new GraphqlRouter()
    //         },
    //         express: <T>() => {
    //             return new ExpressRouter()
    //         },
    //         action: <T>() => {
    //             // TODO return next.js server action
    //         }
    //     }
    // }

    // static get rcs() {
    //     const rcs: string[] = []
    //     if( tsapp.env.TS_RCS || tsapp.env.TS_RCS !== "" ) {
    //         const c_serv = tsapp.env.TS_RCS?.split(",")
    //         if(c_serv) rcs.push(...c_serv)
    //     }
    //     return rcs
    // }

    // static get config() {
    //     return config as Config
    // }

    // static get package() {
    //     const configs = getPackageConfigs() as {[key in Packages]: ReturnType<typeof getPackageConfigs>[string]}
    //     const keys = Object.keys(configs) as Packages[]

    //     // initilize object with empty arrays
    //     const access: IAccessOptions[] = []

    //     for(const key of keys) {
    //         const _config = config[key].access
    //         for(const [_key, value] of Object.entries(_config)) {
    //             for(const [__key, __value] of Object.entries(value)) {
    //                 access.push(__value as any)
    //             }
    //         } 
    //     }

    //     return {
    //         configs,
    //         keys,
    //         access
    //     }
    // }
}

export class TypeStackPackage<Pack extends Package<PackageJson, ConfigInput> = Package<PackageJson, ConfigInput>> {
    options: TypeStackOptions
    pack: Pack

    constructor(pack: Pack, options: Partial<TypeStackOptions> = {}) {
        this.pack = pack
        this.options = { ...pack.options, ...options }
    }
}

export class TypeStackOutputPackage extends TypeStackPackage {
    alias: string

    constructor(pack: TypeStackPackage, alias: string) {
        super(pack.pack, pack.options)
        this.alias = alias

        if(this.pack._config.access)
            this.pack._config.access = getAccessDefaults(this.pack.json.name, this.pack._config.access)
    }
}

export type TypeStackEntryPoint<T extends TypeStackPackage = TypeStackPackage> = {
    [key: string]: T
}

// convert TypeStackEntryPoint to TypeStackEntryPointWithAlias
export type ConvertToEntryPointWithAlias<T extends TypeStackEntryPoint<TypeStackPackage>> = {
    [K in keyof T]: TypeStackOutputPackage;
  };
  

export type TypeStackEntryPointWithAlias<T extends TypeStackOutputPackage = TypeStackOutputPackage> = {
    [key: string]: T
}

export type CWD = ReturnType<typeof TypeStack["findCWD"]>

export type TypeStackConfig<T extends TypeStackEntryPointWithAlias = TypeStackEntryPointWithAlias> = {
    cwd: CWD;
    packages: T;
    entrypoint: TypeStackOutputPackage;
}

export class TypeStack {
    private static _options: InitOptions = defaultInitOptions
    private static _init?: Promise<TypeStackConfig> = undefined

    static async init(options: InitOptions = defaultInitOptions): Promise<TypeStackConfig> {
        this._options = { ...this._options, ...options }
        
        if(!this._init) this._init = this._init = new Promise(async (resolve, reject) => {
            if(this._options.config) {
                resolve(this._options.config)
                return
            }

            this._options.config = await this.getConfig()
            for(const [pack_key, pack] of Object.entries(this._options.config.packages)) {
                await pack.pack.init()
            }
            resolve(this._options.config)
        })
        
        return this._init
    }

    static get rcs() {
        // TODO
        return [] as string[]
    }

    static get config() {
        if(!this._options.config) {
            throw new Error(`TypeStack not initilized`)
        }
        return this._options.config
    }

    static async getConfig(): Promise<TypeStackConfig> {
        if(this._options.config) {
            return this._options.config
        }

        const cwd = this.findCWD(undefined, undefined)
    
        if(!cwd.typestack) {
            throw new Error(`Could not find typestack.json, create typestack.json in root of your project`)
        }
    
        if(!cwd.node_modules) {
            throw new Error(`Could not find node_modules in your project, run npm install`)
        }
    
        // load default
        const mdoule = await import(`${cwd.typestack}/dist/esm/typestack.js`)
        const packages_raw = mdoule.default as TypeStackEntryPoint

        let packages: TypeStackEntryPointWithAlias = {}
        let entrypoint: TypeStackOutputPackage | undefined = undefined
        for(const [alias, value] of Object.entries(packages_raw)) {
            const pack_name = value.pack.json.name
            if(value.options.enabled) {
                // check if package is already included
                if(packages[pack_name]) {
                    throw new Error(`Package with name ${alias}->${pack_name} is already included in typestack.ts under alias ${packages[pack_name].alias}`)
                }
                packages[pack_name] = new TypeStackOutputPackage(value, alias)
            }
            if(pack_name === cwd.entrypoint) {
                entrypoint = packages[pack_name]
            }
        }

        if(!entrypoint) {
            throw new Error(`Could not find entrypoint in typestack.ts`)
        }

        // TODO check if all packages are included in TypeStackEntryPoint
        // this is needed if imported package is using other typestack packages

        return this._options.config = {
            cwd,
            packages,
            entrypoint
        }
    }

    static findCWD(defaultWorkspace: string | undefined = undefined, defaultTypestack: string | undefined = undefined)  {
        let dir = process.cwd()

        // if env var exists use it TS_ENTRY_POINT
        if(tsapp.try?.TS_ENTRY_POINT && tsapp.try.TS_ENTRY_POINT !== '') {
            dir = tsapp.env.TS_ENTRY_POINT
        }

        let workspace: string | undefined // folder path to closest workspace package.json
        let typestack: string | undefined // folder path to closest typestack.json
        let entrypoint: string | undefined // typestack entrypoint package name
    
        if(dir == '/' || dir == '') {
            dir = "/ts"
        }
    
        if(dir.endsWith('/')) {
            dir = dir.slice(0, -1)
        }
    
        // split path into array
        const dirs = dir.split('/')
    
        // loop through path array starting from the last element
        for (let i = dirs.length - 1; i >= 0; i--) {
            // find package.json
            if (fs.existsSync(`${dir}/package.json`)) {
                const read_package = JSON.parse(fs.readFileSync(`${dir}/package.json`, 'utf8'))
                if(read_package.workspaces && workspace == undefined) {
                    workspace = dir
                }
            }
    
            // find typestack.json
            if (fs.existsSync(`${dir}/dist/esm/typestack.js`) && typestack == undefined) {
                typestack = dir
            }
    
            // remove last element from path
            dir = dirs.slice(0, i).join('/')
        }
    
        if(!workspace) {
            workspace = defaultWorkspace || workspace
        }
    
        if(!typestack) {
            typestack = defaultTypestack  || typestack
        }
    
        let node_modules: string | undefined = `${workspace}/node_modules`
    
        if(!fs.existsSync(node_modules)) {
            node_modules = undefined
        }
    
        if(fs.existsSync(`${typestack}/package.json`)) {
            entrypoint = JSON.parse(fs.readFileSync(`${typestack}/package.json`, 'utf8')).name
        }
    
        return {
            workspace,
            typestack,
            node_modules,
            entrypoint
        }
    }

    static findPackage(package_name: string): TypeStackOutputPackage | undefined {
        for(const [alias, value] of Object.entries(this.config.packages)) {
            if(value.pack.json.name == package_name){
                return value
            }
        }
        return undefined
    }
}