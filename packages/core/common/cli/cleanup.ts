import fs from 'fs'
import { DefaultOptions } from '@ts.app/core/common/cli/util.js'
import { TypeStack } from '@ts.app/core'

export const cleanup = async (options: DefaultOptions) => {
    const config = await TypeStack.getConfig()
    const folders = ["common", "components", "consumers", "express", "graphql", "jobs", "models", "tailwind", "updates"]
    const files = ["env.ts", "index.ts"]

    // get all .ts files and remove d.ts, .js, js.map files
    for(const [pack_key, pack] of Object.entries(config.packages)) {
        // remove dist folder
        const dist = `${options.cwd}/packages/${pack.alias}/dist`
        if(fs.existsSync(dist)) {
            fs.rmdirSync(dist, {recursive: true})
            console.log(`Removed ${dist}`)
        }

        for(const file of files) {
            const src = `${options.cwd}/packages/${pack.alias}/${file}`
            if(fs.existsSync(src)) {
                const js = src.replace(".ts", ".js")
                const jsmap = src.replace(".ts", ".js.map")
                const dts = src.replace(".ts", ".d.ts")
                if(fs.existsSync(js)) {
                    fs.unlinkSync(js)
                    console.log(`Removed ${js}`)
                }
                if(fs.existsSync(jsmap)) {
                    fs.unlinkSync(jsmap)
                    console.log(`Removed ${jsmap}`)
                }
                if(fs.existsSync(dts)) {
                    fs.unlinkSync(dts)
                    console.log(`Removed ${dts}`)
                }
            }


            for(const folder of folders) {
                const src = `${options.cwd}/packages/${pack.alias}/${folder}`
                
                const processFiles = (folder: string) => {
                    const files = fs.readdirSync(folder)
                    for(const file of files) {
                        // if folder, recurse
                        if(fs.lstatSync(`${folder}/${file}`).isDirectory()) {
                            processFiles(`${folder}/${file}`)
                        }else{
                            if(file.endsWith(".ts") && !file.endsWith(".d.ts")) {
                                const path = `${folder}/${file}`
                                const js = path.replace(".ts", ".js")
                                const jsmap = path.replace(".ts", ".js.map")
                                const dts = path.replace(".ts", ".d.ts")
                                if(fs.existsSync(js)) {
                                    fs.unlinkSync(js)
                                    console.log(`Removed ${js}`)
                                }
                                if(fs.existsSync(jsmap)) {
                                    fs.unlinkSync(jsmap)
                                    console.log(`Removed ${jsmap}`)
                                }
                                if(fs.existsSync(dts)) {
                                    fs.unlinkSync(dts)
                                    console.log(`Removed ${dts}`)
                                }
                            }
                        }
                    }
                }

                if(fs.existsSync(src)) {
                    processFiles(src)
                }
            }
        }
    }
}