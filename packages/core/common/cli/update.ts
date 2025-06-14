import fs from "fs"
import type { Transaction, UpdateInput, UpdateDocument } from "@ts.app/core/models/update.js"
import { TypeStack, CWD } from "@ts.app/core/common/cli/typestack.js"
import { sleep } from "@ts.app/core/common/cli/util.js"
import tscore from "@ts.app/core"

export type UpdateOptions = {
    cwd: CWD // current working directory
}

export async function update(options: UpdateOptions) {
    await TypeStack.init()

    const { UpdateModel } = await import("@ts.app/core/models/update.js")
    const session = await tscore.db.mongoose.core.startSession()
    session.startTransaction()
    
    // sleep for 3 second, fixes Update error: MongoServerError: Unable to acquire IX lock on
    await sleep(3)

    const pack_updates: UpdateDocument[] = [];
    const pack_errors: UpdateDocument[] = [];

    console.log(`Info, updating packages:`)

    for (const [alias_key, pack] of Object.entries(TypeStack.config.packages)) {
        const pack_key = pack.pack.json.name
        const update_path = `${options.cwd.node_modules}/${pack_key}/dist/esm/updates`
        const pack_version = pack.pack.json.version
        console.log(`Info, ${pack_key}:${pack_version}`)

        if (!fs.existsSync(update_path)) continue

        // read each file in the update folder
        const files = await fs.promises.readdir(update_path)
        for (const file of files) {
            const filePath = `${update_path}/${file}`

            // use .js files only
            if(file.split(".").pop() != "js")
                continue

            const module = await import(filePath)
            
            if(!module.transaction) continue

            const transaction = module.transaction as Transaction

            const update_input: UpdateInput = {
                pack: pack_key as any,
                version: pack_version,
                log: []
            }
        
            const update = await UpdateModel.create(update_input)
            update.log.push({ type: "update", msg: "started" })

            const logFilePath = filePath.replace('.js', '.ts').split('/').slice(-2).join('/')
            console.log(`Info,  ${logFilePath}`)
            await transaction(session, update)
            .then(async () => {
                update.log.push({ type: "update", msg: "completed" })
                pack_updates.push(update)
            })
            .catch(async (err: any) => {
                console.log("Update error in package: ", pack_key)
                console.log("Update error:", err)
                update.log.push({ type: "error", msg: `${err}` })
                pack_errors.push(update)
            })
        }
    }

    if(pack_errors.length > 0) {
        console.log(`Error, update failed`)
        await session.abortTransaction()
        session.endSession()
    }else {
        console.log(`Info, update completed`)
        await session.commitTransaction()
        session.endSession()
    }

    // save each update
    for(const update of pack_updates){
        await update.save()
    }

    // save each error
    for(const update of pack_errors){
        await update.save()
    }

    console.log(`Info, update log saved`)
    process.exit(0)
}