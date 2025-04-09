'use client'

import React from 'react'
import { context } from '@ts.app/core/components/global'


export default function RoleEditor() {
    const { tsappClient, session } = React.useContext(context)
   
    return <div className="h-full grid grid-rows-[auto,auto,1fr] p-4 gap-4 overflow-x-auto overflow-y-hidden max-w-[1500px]">
        TODO Api keys
    </div>
}