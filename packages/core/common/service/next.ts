import tscore, { TypeStack } from "@ts.app/core"
import express from "express"
import next from "next"
import fs from "fs-extra"
import { NextServerOptions } from "next/dist/server/next"

const nextBuild = async (dir: string) => new Promise(async (resolve, reject) => {
    // change cwd directory to dir and run next build ./next
    const { exec } = await import("child_process")

    // skip if build folder already exists
    if(fs.existsSync(`${dir}/.next`)) {
        console.error(`.next folder already exists, skipping next build`)
        resolve(true)
        return
    }

    exec(`npx next build ./appdata/next/`, { cwd: dir }, (err, stdout, stderr) => {
        // CONSOLE LOG SERVER INFO
        console.log(`--------------------NEXT BUILD-------------------------`)
        console.log(`dir: ${dir}`)
        console.log(`cwd: ${process.cwd()}`)
        console.log(`-------------------------------------------------------`)

        if(err) {
            console.log(err)
            reject(err)
        }else {
            console.log(stdout)
            console.log(stderr)
            resolve(true)
        }
    })
})

await TypeStack.init()
.then(async (config) => {
    const server = express()
    const port = 80
    const dir = `${config.entrypoint}/appdata/next`
    const conf_dir = `${dir}/next.config.js`
    const nextConfig = (await import(conf_dir)).default

    const next_options: NextServerOptions = {
        dev: tscore.config.env.tsapp.env.TS_ENV_TYPE == "dev",
        port,
        dir,
        quiet: false,
        customServer: true,
        conf: nextConfig,
    }

    // build next
    if(next_options.dev == false) await nextBuild(dir)

    const app = next(next_options)
    await app.prepare()
    const handle = app.getRequestHandler()

    server.all("*", (req, res) => {
        return handle(req, res)
    })

    server.listen(port)
})
.finally(() => {
    // CONSOLE LOG SERVER INFO
    console.log(`------------------NEXT SERVER INFO---------------------`)
    console.log(`SERVER :  https://${tscore.config.env.tsapp.env.TS_DOMAIN_NAME}`)
    console.log(`ENV    :  env.TYPE: ${tscore.config.env.tsapp.env.TS_ENV_TYPE}`)
    console.log(`-------------------------------------------------------`)
})