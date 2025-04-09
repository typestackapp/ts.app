'use client'

import React from 'react'
import { IAccessDocument } from '@ts.app/core'
import { context } from '@ts.app/core/components/global'
import { getRoleManagerData, useQuery, client } from '@ts.app/core/components/queries'
import { AccessValidator } from '@ts.app/core/models/user/access/util'
import { ValuesType } from 'utility-types'

// type AccessConfig = ValuesType<NonNullable<client.GetRoleManagerDataQuery["getAllAccessConfigs"]>>
type Scope = ValuesType<NonNullable<client.GetRoleManagerDataQuery["getAllAccessConfigs"]>>

const permissions: client.PermissionType[] = [
    client.PermissionType.Read, 
    client.PermissionType.Write,
    client.PermissionType.Delete,
    client.PermissionType.Update
]
const statuses: client.AccessStatus[] = [
    client.AccessStatus.Enabled,
    client.AccessStatus.Disabled,
]

const getAlias = (pack: string, data: client.GetRoleManagerDataQuery) => data?.getAllPackageConfigs.find(config => config.pack === pack)?.alias
const getRole = (roleID: string | undefined, data: client.GetRoleManagerDataQuery) => data?.getAllRoles?.find(role => role._id === roleID)
const findRoleAccess = (roleID: string  | undefined, access: IAccessDocument, data: client.GetRoleManagerDataQuery) => {
    const role = getRole(roleID, data)
    if(!role) return undefined
    return role.data.resource_access.find(acc => acc.pack === access.pack && acc.resource === access.resource && acc.action === access.action)
}
const matchRoleAccessScope = (roleAccess: IAccessDocument, scope: Scope) => {
    if(roleAccess.pack && roleAccess.resource && roleAccess.action) {
        return roleAccess.pack === scope.pack && roleAccess.resource === scope.resource && roleAccess.action === scope.action && scope.permission && roleAccess.permissions.includes(scope.permission)
    }

    if(roleAccess.pack && roleAccess.resource) {
        return roleAccess.pack === scope.pack && roleAccess.resource === scope.resource && scope.permission && roleAccess.permissions.includes(scope.permission)
    }

    if(roleAccess.pack) {
        return roleAccess.pack === scope.pack && scope.permission && roleAccess.permissions.includes(scope.permission)
    }

    return false
}

export default function RoleEditor() {
    const { tsappClient, session } = React.useContext(context)
    const query = useQuery(getRoleManagerData)
    const [data, setData] = React.useState<client.GetRoleManagerDataQuery | undefined>(!query.data? undefined: JSON.parse(JSON.stringify(query.data)))
    const [roleID, setRoleID] = React.useState<string>()
    const [roleAccess, setRoleAccess] = React.useState<IAccessDocument>()

    React.useEffect(() => {
        setData(!query.data? undefined: JSON.parse(JSON.stringify(query.data)))
        if (query.data?.getAllRoles) {
            setRoleID(query.data.getAllRoles[0]._id)
        }
    }, [query.data])

    React.useEffect(() => {
        if (query.data?.getAllRoles && roleID) {
            //setRoleAccess(query.data.getAllRoles[0].data.resource_access[0])
            setRoleAccess(undefined)
        }else{
            setRoleAccess(undefined)
        }
    }, [roleID])

    if (!data) return <div className="flex items-center justify-center h-screen">Loading...</div>

    return <div className="h-full grid grid-rows-[auto,auto,1fr] p-4 gap-4 overflow-x-auto overflow-y-hidden max-w-[1500px]">
        <div className='col-span-2 overflow-hidden max-h-[50px]'>
            {/* pick role dropdown */}
            <select className="p-2 border border-gray-300 rounded" defaultValue={roleID} onChange={e => setRoleID(e.target.value === "None" ? undefined : e.target.value)}>
                <option>None</option>
                {data?.getAllRoles?.map(role => <option key={role._id} value={role._id}>{role.data.name}</option>)}
            </select>

            {/* search */}
            <input type="text" className="p-2 border border-gray-300 rounded ml-2" placeholder="Search" />
            
            {/* update */}
            <button className="p-2.5 bg-primary text-white rounded ml-2">Update</button>
        </div>

        <div className='w-full overflow-auto max-xl:col-span-2'>
            <RoleAccessTable roleID={roleID} data={data} setData={setData} roleAccess={roleAccess} setRoleAccess={setRoleAccess} />
        </div>
        <div className='w-full overflow-auto max-xl:col-span-2'>
            <ScopeTable roleID={roleID} data={data} roleAccess={roleAccess} />
        </div>
    </div>
}

export function RoleAccessTable({ roleID, data, setData, setRoleAccess, roleAccess }: {
    roleID: string | undefined,
    data: client.GetRoleManagerDataQuery,
    setData: (data: client.GetRoleManagerDataQuery) => void,
    setRoleAccess: (scope: IAccessDocument | undefined) => void,
    roleAccess?: IAccessDocument
}) {
    if(!roleID) return <div></div>
    const role = getRole(roleID, data)
    if(!role) return <div></div>

    const updateStatus = (e: React.ChangeEvent<HTMLSelectElement>, access: IAccessDocument) => {
        console.log(`setting status to ${e.currentTarget.value}, from ${access.status}`)
        access.status = e.currentTarget.value as client.AccessStatus
        setData({...data})
    }

    return <table className="w-full table-auto border-r border-l">
        <thead className="bg-gray-200 sticky top-0">
            <tr>
                <th className="py-2 px-1 border-r border-gray-300">Package</th>
                <th className="py-2 px-1 border-r border-gray-300">Resource</th>
                <th className="py-2 px-1 border-r border-gray-300">Action</th>
                {permissions.map((permission, index) => <th key={index} className="py-2 px-1 border-r border-gray-300">{permission}</th>)}
                <th className="py-2 px-1 border-r border-gray-300">Status</th>
            </tr>
        </thead>
        <tbody>
            {role.data.resource_access.map((access, index) => 
                <tr
                    key={index}
                    onClick={() => roleAccess === access? setRoleAccess(undefined): setRoleAccess(access)}
                    className={ roleAccess && findRoleAccess(roleID, access, data) === roleAccess ? "border-b bg-blue-200 cursor-pointer" : "border-b border-gray-300 hover:bg-gray-100 cursor-pointer"}
                >
                    <td className="p-1 border-r border-gray-300 text-nowrap">
                        {getAlias(access.pack, data)}
                    </td>
                    <td className="p-1 border-r border-gray-300 text-nowrap">
                        {access.resource || "*"}
                    </td>
                    <td className="p-1 border-r border-gray-300 text-nowrap">
                        {access.action || "*"}
                    </td>
                    {permissions.map((permission, index) => 
                        <td key={index} className="p-1 border-r border-gray-300 text-nowrap text-center">
                            <input 
                                type="checkbox" 
                                defaultChecked={access.permissions.includes(permission)} 
                                onClick={e => e.stopPropagation()} 
                            />
                        </td>
                    )}
                    <td className="p-1 border-r border-gray-300 text-nowrap text-center">
                        <select 
                            className="px-1 border border-gray-300 rounded"
                            value={access.status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateStatus(e, access)}
                        >
                            {statuses.map((status, index) => <option key={index} value={status}>{status}</option>)}
                        </select>
                    </td>
                </tr>
            )}
        </tbody>
    </table>
}

export function ScopeTable({ roleID, data, roleAccess }: {
    roleID: string | undefined,
    data: client.GetRoleManagerDataQuery,
    roleAccess: IAccessDocument | undefined,
}) {
    const role = getRole(roleID, data)
    let access = roleAccess ? [roleAccess] : role?.data?.resource_access || []
    const validator = new AccessValidator(access)
    const scopes = [...data.getAllAccessConfigs].sort((a, b) => a.permission == undefined? 1: -1)

    return <table className="w-full table-auto border-r border-l">
        <thead className="bg-gray-200 sticky top-0">
            <tr>
                <th className="py-2 px-1 border-r border-gray-300">Granted</th>
                <th className="py-2 px-1 border-r border-gray-300">Package</th>
                <th className="py-2 px-1 border-r border-gray-300">Resource</th>
                <th className="py-2 px-1 border-r border-gray-300">Action</th>
                <th className="py-2 px-1 border-r border-gray-300">Permission</th>
            </tr>
        </thead>
        <tbody>
            {scopes.map((scope, index) => 
                <tr
                    key={index}
                    className={roleAccess && matchRoleAccessScope(roleAccess, scope) ? "border-b bg-blue-200" : "border-b border-gray-300"}
                    title={scope?.info?.join("\n") || "-"}
                >
                    <td className="p-1 border-r border-gray-300 text-nowrap text-center">
                        {validator.checkAccess(scope) ? "✅" : "❌"}
                    </td>
                    <td className="p-1 border-r border-gray-300 text-nowrap">
                        {getAlias(scope.pack, data)}
                    </td>
                    <td className="p-1 border-r border-gray-300 text-nowrap">
                        {scope.resource}
                    </td>
                    <td className="p-1 border-r border-gray-300 text-nowrap">
                        {scope.action}
                    </td>
                    <td className="p-1 border-r border-gray-300">
                        {scope.permission || "-"}
                    </td>
                </tr>
            )}
        </tbody>
    </table>
}