'use client'
import React from 'react'
import { getAdminData, useQuery } from '@ts.app/core/components/queries.js'
import { LogoutBtn } from '@ts.app/core/components/util.js'

export default function Account() {
  const { data } = useQuery(getAdminData, { fetchPolicy: "cache-first" })

  if(!data) return <div>Loading...</div>

  const email = data?.getCurrentUser?.usn
  const roles = data?.getCurrentUser?.roles

  // shrink items
  return <div className="flex flex-col gap-2">
    <h1>Account Information</h1>
    <div>Email: {email}</div>
    <div>Roles: {roles?.map(role => role.data.name).join(', ')}</div>
    <div className="shrink"><LogoutBtn /></div>
  </div>
}