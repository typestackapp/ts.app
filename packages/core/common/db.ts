import postgres from 'pg'
import { MongoClient, MongoOptions } from 'mongodb'
import mysql, { Pool as MysqlConnection } from 'mysql2/promise'
import mssql, { ConnectionPool as MssqlConnection } from 'mssql'
import mongoose from 'mongoose'
import { Sequelize, Options } from 'sequelize'
import { ConfigInput, Package } from '@ts.app/core/common/cli/typestack'

interface ConnConfig<T> {
    options: T
}

interface ConnConfigHost<T> extends ConnConfig<T> {
    host: string
}

export interface ConnectionType {
    // DB
    mongo: {
        client: MongoClient,
        config: ConnConfigHost<MongoOptions>
    },
    postgres: {
        client: typeof postgres.Pool,
        config: ConnConfig<postgres.PoolConfig>
    }
    mysql: {
        client: MysqlConnection,
        config: ConnConfig<mysql.PoolOptions>
    },
    mssql: {
        client: MssqlConnection,
        config: ConnConfig<mssql.config>
    },
    // ORM
    mongoose: {
        client: mongoose.Connection,
        config: ConnConfigHost<mongoose.ConnectOptions>
    },
    sequelize: {
        client: Sequelize,
        config: ConnConfig<Options>
    }
}

export interface ConnectionOptions {
    disabled: boolean, // skips connection if enabled
}

export type DBConnectionInput = {
    [ CType in keyof ConnectionType ]?: {
        [ CKey: string ]: {
            conn: ConnectionType[CType]['config'],
        }
    }
}

export type DBConnectionOutput<CInput extends ConfigInput = ConfigInput> = {
    [CType in keyof CInput['db'] & keyof ConnectionType]: {
        [CKey in keyof CInput['db'][CType]]: ConnectionType[CType]['client']
    }
}

export default class DB<Config extends ConfigInput = ConfigInput> {
    private promise?: Promise<DBConnectionOutput<Config>>

    constructor() {
    }

    public getInstance(pack: Package): Promise<DBConnectionOutput<Config>> {
        if(this.promise) return this.promise

        const connections: Promise<boolean>[] = []
        const _conns: any = {}

        // connect to configured databases
        for (const [conn_key, conn] of Object.entries(pack.config.db || {})) {
            for (const [config_key, config] of Object.entries<any>(conn)) {
                _conns[conn_key] = _conns[conn_key] || {}
                _conns[conn_key][config_key] = _conns[conn_key][config_key] || {}

                if( config?.options?.disabled ) { // skip connection if disabled
                    // console.log(`WARNING, skipping connection for DB ${pack_key}.${conn_key}.${config_key}.options == true`)
                    continue
                }
                    
                let _connection = this.connect(conn_key, config.conn)
                
                // if connection is a promise, wait for it to resolve
                let _promise = new Promise<boolean>(async (resolve) => {
                    _conns[conn_key][config_key] = await _connection
                    resolve(true)
                })

                connections.push(_promise)
            }
        }
        
        return this.promise = new Promise<DBConnectionOutput<Config>>(async (resolve, reject) => {
            await Promise.all(connections)
            resolve(_conns as DBConnectionOutput<Config>)
        })
    }

    private connect(conn_type: string, _conn: any): any {
        switch (conn_type) {
            case "mongo": return new MongoClient(_conn.host, _conn.options).connect()
            case "postgres": return new postgres.Pool(_conn)
            case "mysql": return mysql.createPool(_conn)
            case "mssql": return mssql.connect(_conn)
            case "mongoose": return mongoose.createConnection(_conn.host, _conn.options)
            case "sequelize": return new Sequelize(_conn)

            default:
                throw "DB, connection type not supported"
        }
    }
}