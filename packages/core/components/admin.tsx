import React from 'react'
import { context } from '@ts.app/core/components/global'
import { Admin, AdminApp, AppConfig, ErrorBoundary, Login } from '@ts.app/core/components/util.js'
import { ApolloProvider } from "@apollo/client"
import { getAdminData, useQuery } from '@ts.app/core/components/queries'

export default function AdminLayoutContext({ children, apps }: {
  apps : AppConfig[],
  children: React.ReactNode
}) {
  const ctx = React.useContext(context)
  return <context.Provider value={ctx}>
    <ApolloProvider client={ctx.tsappClient.graphql["@ts.app/core"].admin}>
      <AdminLayout children={children} apps={apps}/>
    </ApolloProvider>
  </context.Provider>
}

function AdminLayout({ children, apps }: {
  apps : AppConfig[],
  children: React.ReactNode 
}) {
  const init = React.useRef(false)
  const ctx = React.useContext(context)
  const [session, setSession] = React.useState(ctx.tsappClient.getCurrentSession())
  const [adminApps, setAdminApps] = React.useState<AdminApp[] | undefined>(ctx.apps?.state || undefined)
  const adminUser = useQuery(getAdminData, { fetchPolicy: "cache-first" })
  const access = adminUser?.data?.getCurrentUser?.roles?.map( role => role.data.resource_access )

  ctx.session = { state: session, setState: setSession }
  ctx.apps = { state: adminApps, setState: setAdminApps }

  React.useEffect(() => {
    if (!init.current) {
      init.current = true
      ctx.tsappClient.getActiveSession()
      .then((data) => setSession(data))
      .catch((error) => setSession({ error: { code: "session-fetch-error", msg: error }, data: undefined}))
    }
    
    if(adminUser.error) adminUser.refetch()
  }, [session])

  const getError = (code: string, msg: string) => {
    if(code == "invalid-auth-no-token-found") return <></>
    if(code == "graphq-error" && msg == "No valid token isTokenValid") return <></>
    return <div className="w-[300px] flex flex-col rounded-md shadow-md px-4 py-4 border">
      <div className="text-red-500 text-sm">Error: {code}</div>
      <div className="text-red-500 text-sm">Message: {msg}</div>
    </div>
  }
  
  // loading
  if(adminUser.loading)
    return <div className="flex flex-col items-center justify-center w-full h-full">
      Loading...
    </div>

  // login
  if(adminUser.error || (session && session.error))
    return <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <div className="w-[300px]">
        <ErrorBoundary>
          <Login/>
        </ErrorBoundary>
      </div>

      {adminUser.error && getError("graphq-error", adminUser.error.message)}
      {session && session.error && getError(session.error.code, session.error.msg)}
    </div>

  // admin
  return <Admin apps={apps} children={children} access={access} open={false}/>
}