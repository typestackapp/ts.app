
import crypto from "crypto"
import type { IAccessInput, IAccessStatus, IPermissionType, IAccessOptions } from '@ts.app/core/codegen/admin/index.js'
import type { RoleConfigDocument } from '@ts.app/core/models/config/role.js'
import type { AccessOutput } from "@ts.app/core/models/user/access.js"
import type { Maybe } from "graphql/jsutils/Maybe"
import type { GraphqlServerOutput } from "@ts.app/core/common/cli/typedefs.js"

export function secretCompare(secret: string, saved_salt_hash: string, iterations: number = 1000, keylen: number = 64, digest: string = 'sha512'): boolean {
    var [salt, hash] = saved_salt_hash.split('.')
    var _hash = crypto.pbkdf2Sync(secret, salt, iterations, keylen, digest).toString(`hex`); 
    return _hash === hash;
}

export function secretHash(secret: string, iterations: number = 1000, keylen: number = 64, digest: string = 'sha512'): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(secret, salt, iterations, keylen, digest).toString(`hex`)
    return `${salt}.${hash}`
}

export function randomSecret(str_length: number): string {
    const rand = crypto.randomBytes(str_length);
    return rand.toString('base64').slice(0, str_length);
}

export async function checkRolesAccessToGraphqlService(roles: RoleConfigDocument[], options: Pick<GraphqlServerOutput, "pack" | "name">): Promise<boolean> {
    for(const role of roles) {
        if(role.data.graphql_access) {
            for(const access of role.data.graphql_access) {
                if(access.pack == options.pack && access.services.includes(options.name)) {
                    return true
                }
            }
        }
    }

    throw `User does not have access to pack:${options.pack} name:${options.name}`
}

export function arrayToObject(array: [], keyField: string) {
    return array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
    }, {});
}

export interface AccessCheckOptions extends Pick<IAccessOptions, "pack" | "resource" | "action"> {
    permission?: Maybe<IPermissionType>
}

export type Access = AccessOutput | IAccessInput

export class AccessValidator {
    private access_provided: Access[] = []

    constructor(access_provided: Access[][] | Access[]) {
        for(const access of access_provided) {
            if(Array.isArray(access)) {
                this.access_provided.push(...access)
            }else {
                this.access_provided.push(access)
            }
        }
    }

    getAccessProvided() {
        return this.access_provided
    }

    getOptions(access: AccessOutput | IAccessInput, permission?: IPermissionType): AccessCheckOptions {
        return {
            pack: access.pack,
            resource: access.resource,
            action: access.action,
            permission
        }
    }
    
    checkResourceAccess(access_required: Access[]) {
        const has_access: AccessCheckOptions[] = []
        const no_access: AccessCheckOptions[] = []
        for(const required of access_required) {
            for(const permission of required.permissions) {
                const options = this.getOptions(required, permission)
                if(!this.checkAccess(options)) {
                    no_access.push(options)
                }else {
                    has_access.push(options)
                }
            }
        }
    
        return {
            has_full_access: no_access.length == 0,
            has_partial_access: has_access.length > 0,
            has_access, // list of access required and found
            no_access // list of access required but not found
        }
    }

    // check this.access_provided has explicitly disabled access via action
    explicitlyDisabled(options: AccessCheckOptions): boolean {
        return this.access_provided.find((access) => {
            return access.pack == options.pack
                && access.resource == options.resource
                && access.action == options.action
                && access.status == "Disabled"
        }) != undefined
    }
    
    checkAccess( options: AccessCheckOptions ): boolean {
        const enabled_access_status: IAccessStatus[] = ["Enabled"]
        const required_permission: IPermissionType | undefined = options.permission || undefined
        const required_resource = options.resource
        const required_action = options.action
        const required_pack = options.pack
    
        if(!required_permission) return true
        
        for(const user_access of this.access_provided) {
            // pack keys should match
            if(user_access.pack != required_pack) continue
    
            // user access should be enabled
            if(!enabled_access_status.includes(user_access.status)) continue

            // access via pack level
            if( user_access.action == undefined 
                && user_access.resource == undefined
                && user_access.permissions.includes(required_permission)
                && !this.explicitlyDisabled(options)
            ) return true
    
            // access via resource level 
            if( user_access.action == undefined 
                && user_access.resource == required_resource
                && user_access.permissions.includes(required_permission)
                && !this.explicitlyDisabled(options)
            ) return true
    
            // access via action level 
            if( user_access.action == required_action 
                && user_access.resource == required_resource
                && user_access.permissions.includes(required_permission)
            ) return true
        }
    
        return false
    }

    findAccessProvided(options: AccessCheckOptions) {
        const arr: Access[] = []
        for(const user_access of this.access_provided) {
            const valid = new AccessValidator([user_access])
            if(valid.checkAccess(options) && options.permission) {
                arr.push(user_access)
            }
        }
        return arr
    }
}