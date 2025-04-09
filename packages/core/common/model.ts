
import { TypeStack } from "@ts.app/core"
import fs from "fs"

// export static class named ModelLoader
export class ModelLoader {
    static loadedModels: { [key: string]: boolean } = {};

    static async loadAllModels() {
        TypeStack.config
        for (const [pack_alias, pack] of Object.entries(TypeStack.config.packages)) {
            await ModelLoader.loadModels(pack.pack.json.name)
        }
    }

    static async loadModels(pack: string) {
        if (ModelLoader.loadedModels[pack]) return;

        ModelLoader.loadedModels[pack] = true;
        const model_path = `${process.cwd()}/node_modules/${pack}/models/`;
        const job_path = `${process.cwd()}/node_modules/${pack}/jobs/`;

        const loadAllModels = async (path: string) => {
            const files = fs.readdirSync(path);
            for (const file of files) {
                if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
                    await loadAllModels(`${path}/${file}`)
                    continue
                }

                // skip non js files
                if (!file.endsWith(".js")) continue;
                // skip map.js files
                if (file.endsWith(".map.js")) continue;
                
                await import(`${path}/${file}`)
                .then((model) => {})
                .catch((err) => {
                    ///console.log(err);
                })
                
            }
        }

        // load models if exists
        if( fs.existsSync(model_path) ) await loadAllModels(model_path);
        if( fs.existsSync(job_path) ) await loadAllModels(job_path);
    }
}


