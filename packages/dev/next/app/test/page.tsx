'use client'
// import '@ts.app/dev/next/public/dev.css'

import React from 'react'
import { context } from '@ts.app/core/components/global.js'
import { ApolloProvider } from "@apollo/client"

// test page is Accessible in:
  // /admin/dev/Test/DevApp panel when access is given to /configs/source/access.json/Test.DevApp resource
  // or next.js app route /test 
export default function TestPage() {
  const ctx = React.useContext(context)
  return (
    <ApolloProvider client={ctx.tsappClient.graphql["@ts.app/dev"].system}>
      <div>test page</div>
    </ApolloProvider>
  )
}