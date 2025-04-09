"use client"
import { Dispatch, SetStateAction, createContext} from 'react'
import frontend from '@ts.app/core/codegen/config/source/@ts.app/core/frontend.public.json'
import TSAppClient from '@ts.app/core/models/user/app/oauth/client/tsapp.js'
import type { ClientSession } from '@ts.app/core/models/user/app/oauth/client.js'
import type { AdminApp } from '@ts.app/core/components/util.js'

export type Session = {
    state: undefined | false | ClientSession,
    setState: Dispatch<SetStateAction<ClientSession | false>>
}

export type Apps = {
    state: undefined | AdminApp[],
    setState: Dispatch<SetStateAction<undefined | AdminApp[]>>
}

export abstract class IGlobalContext {
    abstract readonly config: typeof frontend
    abstract readonly tsappClient: TSAppClient

    apps: Apps | undefined
    app_filter: string

    get session(): Session | undefined {
        return this.session
    }

    set session(session: Session) {
        if(session !== undefined) throw new Error("Cannot set session")
        this.session = session
    }
}

export const context = createContext<IGlobalContext>({
    tsappClient: new TSAppClient(frontend),
    config: frontend,
    session: undefined,
    apps: undefined,
    app_filter: '',
})