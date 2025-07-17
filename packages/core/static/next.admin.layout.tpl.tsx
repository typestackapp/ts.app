'use client'
import React from 'react'
import AdminLayout from '@ts.app/core/components/admin.js'
// import '@ts.app/core/next/public/ts.css'
import { apps } from '${@PACKAGE}/next/apps.js'
export default function AdminLayoutContext({ children }: { children: React.ReactNode }) {
    return <AdminLayout apps={apps} children={children}/>
}