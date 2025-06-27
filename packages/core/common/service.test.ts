import { tsapp } from "@ts.app/core/configs/env.js"
import { TypeStack, ExpressRouter } from "@ts.app/core"
import { describe, it, expect } from "vitest"

describe('Test ExpressRouter', () => {
    it('should get paths', async () => {
        const paths = ExpressRouter.getPaths([
            "/api/core_test_ping_pong",
            "/api/test/[ping]_[pong]",
            "/api/test/[ping]/[pong]",
            "/api/test/[ping_param]_[pong_param]",
            "/api/test/[ping_param]/[pong_param]",
            "/api/util/dropbox/:ApiKey/:key_id",
            "/api/test/cache_[ApiKey]_[file]",
            "/api/test/cache_[ApiKey]_[file]/cache_[ApiKey]/:file",
            "/api/test/cache_[ApiKey]_cache_test.pdf",
        ])
        expect(paths).to.be.deep.equal([
            "/api/core/test/ping/pong",
            "/api/test/:ping/:pong",
            "/api/test/:ping/:pong",
            "/api/test/:ping_param/:pong_param",
            "/api/test/:ping_param/:pong_param",
            "/api/util/dropbox/:ApiKey/:key_id",
            "/api/test/cache/:ApiKey/:file",
            "/api/test/cache/:ApiKey/:file/cache/:ApiKey/:file",
            "/api/test/cache/:ApiKey/cache/test.pdf",
        ])
    })
})

describe('Test services', () => {
    // should have @ts.app/dev package installed
    it('should have @ts.app/dev package installed', async () => {
        expect(Object.keys(TypeStack.config.packages)).to.include("@ts.app/dev")
    })

    it('should reach api endpoint', async () => {
        // fetch till it gets response from server
        let is_ok = false
        while(!is_ok) {
            is_ok = await fetch(`http://${tsapp.env.TS_IP}:8000/api`)
            .then( response => is_ok = true )
            .catch( error => is_ok = false )
        }
    })

    it('should reach ping endpoint via alias', async () => {
        (await fetch(`http://${tsapp.env.TS_IP}:8000/api/dev/test/ping`)).json()
    })

    it('should reach ping endpoint via package name', async () => {
        (await fetch(`http://${tsapp.env.TS_IP}:8000/api/@ts.app/dev/test/ping`)).json()
    })

    it('should reach ping endpoint via custom path', async () => {
        (await fetch(`http://${tsapp.env.TS_IP}:8000/api/test/ping`)).json()
    })

    it('should return default response success true', async () => {
        const is_ok = await fetch(`http://${tsapp.env.TS_IP}:8000/api/@ts.app/dev/test/ping`)
        .then( response => response.json() )
        .then( json => json.data )
        expect(is_ok).to.be.equal(true)
    })

    it('should throw error on ping post endpoint', async () => {
        const is_ok = await fetch(`http://${tsapp.env.TS_IP}:8000/api/@ts.app/dev/test/ping`, { method: 'POST' })
        .then( response => response.json() )
        .then( json => json.error )
        expect(is_ok.code).to.be.equal("unknown")
    })
})