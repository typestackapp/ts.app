"use client"
import React from 'react'
import { Login } from '@ts.app/core/components/util.js'
import { context } from '@ts.app/core/components/global.js'
import { Main } from '@ts.app/core/components/util.js'
import { useParams, useSearchParams } from 'next/navigation'
import { AuthOutput } from '@ts.app/core/express/auth.js'

export type AdminParams = {
  client_id: string
  action: 
  | "authorize" // generate new authorization url and redirect user to external app authorization page
  | "grant" // grants app user access and redirect to callback_url
  | "callback" // handles extermal app access grants and redirect to redirect_url
}

export type AdminSearchParams = {
  code: string | null
  state: string | null
}

export default function Page() {
  const init = React.useRef(false)
  const globalContext = React.useContext(context)
  const [session, setSession] = React.useState(globalContext.tsappClient.getCurrentSession())
  const [app, setApp] = React.useState<AuthOutput["app"] | undefined>()
  const [callback, setCallback] = React.useState<AuthOutput["callback"] | undefined>()

  globalContext.session = {state: session, setState: setSession}
  const {client_id, action} = useParams() as AdminParams
  const searchParams = useSearchParams()

  const adminSearchParams = {
    code: searchParams?.get("code") || null,
    state: searchParams?.get("state") || null
  } satisfies AdminSearchParams

  React.useEffect(() => {
    if(init.current && session && session.data) {
      new Promise(async () => {
        await globalContext.tsappClient.auth.app
        .query({client_id})
        .then((app) => setApp(app))
        .catch((error) => setApp({ error: { code: "app-fetch-error", msg: error }, data: null}))
      })
    }

    if (!init.current) {
      init.current = true
      globalContext.tsappClient.getActiveSession()
      .then((data) => setSession(data))
      .catch((error) => setSession({ error: { code: "session-fetch-error", msg: error }, data: undefined}))
    }
  }, [session])

  React.useEffect(() => {
    handleCallback().catch((error) => setCallback({ error: { code: "callback-fetch-error", msg: error }, data: undefined}))
    handleAuthorize().catch((error) => setCallback({ error: { code: "authorize-fetch-error", msg: error }, data: undefined}))
  }, [app])

  const handleAuthorize = async () => {
    console.log("processing authorize")
    if(action != "authorize") {
      console.log("invalid action")
      return
    }

    if(!session) {
      console.log("invalid session")
      return
    }

    if(!app) {
      console.log("invalid app")
      return
    }

    if(app.error) {
      console.log(app.error)
      return
    }

    if(session.error) {
      console.log(session.error)
      return
    }

    const authorize = await globalContext.tsappClient.auth.authorize.mutate({
      client_id
    })

    if(authorize.error || !authorize.data) {
      console.log(authorize.error)
      return
    }

    // redirect to authorize_url
    window.location.href = authorize.data.authorize_url
  }

  const handleCallback = async () => {
    console.log("processing callback")
    if(action != "callback") {
      console.log("invalid action")
      return
    }

    if(!session) {
      console.log("invalid session")
      return
    }

    if(!app) {
      console.log("invalid app")
      return
    }
    
    if(!adminSearchParams.code) {
      console.log("invalid code")
      return
    }

    if(!adminSearchParams.state) {
      console.log("invalid state")
      return
    }

    if(app.error) {
      console.log(app.error)
      return
    }

    if(session.error) {
      console.log(session.error)
      return
    }

    if(!app.data) {
      console.log("invalid app")
      return
    }
    
    const callback = await globalContext.tsappClient.auth.callback.mutate({
      client_id,
      code: adminSearchParams.code,
      state: adminSearchParams.state
    })

    setCallback(callback)

    if(callback.error || !callback.data) {
      console.log(callback.error)
      return
    }

    // redirect
    window.location.href = callback.data
  }

  const handleGrant = async () => {
    console.log("processing grant")
    if(action != "grant") {
      console.log("invalid action")
      return
    }

    if(!session) {
      console.log("invalid app")
      return
    }

    if(!app) {
      console.log("invalid app")
      return
    }

    if(app.error) {
      console.log(app.error)
      return
    }

    if(session.error) {
      console.log(session.error)
      return
    }

    const authorize = await globalContext.tsappClient.auth.grant.mutate({
      client_id,
      response_type: "code"
    })

    if(authorize.error || !authorize.data) {
      console.log(authorize.error)
      return
    }

    const query = new URLSearchParams()
    query.set("code", authorize.data.code)
    if(adminSearchParams.state) query.set("state", adminSearchParams.state)

    const callback_url = `${app.data.callback_url}?${query.toString()}`
    console.log(callback_url)
  }

  if(!session) {
    return (
      <div>loading...</div>
    )
  }

  if(session?.error || !session?.data) return (
    <context.Provider value={globalContext}>
      <Login/>
    </context.Provider>
  )

  if(action == "authorize") return (
    <context.Provider value={globalContext}>
      <div className="flex h-full">
        <Main>
          authorize
        </Main>
      </div>
    </context.Provider>
  )

  if(action == "grant") return (
    <context.Provider value={globalContext}>
      <div className="flex h-full">
        <Main>
          access required:
          {JSON.stringify(app?.data?.access)}
          <button onClick={handleGrant}>Grant Access</button>
        </Main>
      </div>
    </context.Provider>
  )

  if(action == "callback") return (
    <context.Provider value={globalContext}>
      <div className="flex h-full">
        <Main>
          callback
        </Main>
      </div>
    </context.Provider>
  )

  return (
    <context.Provider value={globalContext}>
      <div className="flex h-full">
        <Main>
          error
        </Main>
      </div>
    </context.Provider>
  )
}