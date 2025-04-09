import { DBConnectionInput } from '@ts.app/core/common/db'
import { U as Tailwind } from 'tailwindcss/dist/types-B254mqw1.mjs'
import { Module } from '@ts.app/core/common/cli/env'
import { RMQConnectionInput } from '@ts.app/core/common/rabbitmq/connection'
import { IAccessOptions, IAdminOptions } from '@ts.app/core'

// options from graphql.json config file
export interface GraphqlServerInput {
    isServer: boolean // start graphql server
    isPublic: boolean // remove authentification from graphql server, will have public scheam
    genClient: boolean // generate client queries
    modules: string[] // module file paths 
    documents?: string[] // document file paths, will be used to generate graphql client
}

// automaticly generated, cant be rewritten
export interface GraphqlServerOutput extends GraphqlServerInput {
    name: string // graphql config key name
    pack: string // package name, automaticly generated
    typeDefPath: string // output path for type definitions
    clientPath: string // output path for client
    serverPath: string // rewrite server path,
}

export type TailwindModule = {
    [key: string]: TailwindInput
}
export type TailwindInput = {
    input: string, 
    output: string, 
    config: Tailwind
}

export interface AccessInput {
    info?: string[]
    admin?: Omit<IAdminOptions, "hash">
}

interface ServiceConfig {
    template: string;
    service: string;
    name: string;
    e?:  { [key: string]: string; }
}

export interface ServiceConfigInput {
    start: {
        dev: ServiceConfig[];
        prod: ServiceConfig[];
    };
    templates: {
        [key: string]: string;
    };
    services: {
        [key: string]: {
            script: string;
            args: string;
        };
    };
}

export type ConfigInput = {
    [key: string]: unknown // any package can have additional custom config
    access?: {[resource: string]: {[action: string]: AccessInput}}
    countrys?: any
    db?: DBConnectionInput
    env?: Module
    frontend?: any
    graphql?: {[name: string]: GraphqlServerInput}
    rabbitmq?: RMQConnectionInput
    services?: ServiceConfigInput
    system?: any
    templates?: any
    timezones?: any
    tailwind?: {[name: string]: TailwindInput}
}

export type ConfigOutput<T extends ConfigInput> = {
    [K in keyof T]: K extends "access"
        ? T["access"] extends undefined ? undefined : { [resource in keyof T["access"]]: { [action in keyof T["access"][resource]]: IAccessOptions } }
        : T[K];
};


export type PackageJsonModule = {
    types: string
    import: string
    require: string
}
  
export type ExportsField = string | { [key: string]: string | ExportsField | PackageJsonModule }

export type PackageJson = {
    name: string
    version: string
    description?: string
    main?: string
    module?: string | { [key: string]: string | PackageJsonModule }
    type?: string
    exports?: ExportsField
    scripts?: {
        [key: string]: string
    }
    repository?: {
        type: string
        url: string
    }
    devDependencies?: {
        [key: string]: string
    }
    dependencies?: {
        [key: string]: string
    }
    bin?: string | { [key: string]: string }
    license?: string
    keywords?: string[]
    author?: string | { name: string; email?: string; url?: string }
}