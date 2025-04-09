import zod, { z } from "zod"
import path from "path"
import fs from "fs"
import { prepareEnvVars } from "@ts.app/core/common/cli/util.js"

export { zod }

export type EnvFile = {
    path: string,
    vars: string
}

export type Module = {
    [key: string]: ENV<ZodEnvObject>;
}

export type EnvObject = {
    [key: string]: string | number | boolean | undefined;
}

export type EnvOptions = {
    example: boolean // @default true // creates example file to appdata/${alias}.env
    service: boolean // @default false // creates service.env file in appdata/docker-${alias}/... that can be used to import env vars to other containers
    default: boolean // @default false // creates default.env file in appdata/docker-${alias}/..., automaticly improts it to ts node.js container
}

// only allow object where values can be string number or boolean
export type ZodEnvObject = {
    [key: string]: zod.ZodType<string | undefined> | zod.ZodType<number | undefined> | zod.ZodType<boolean | undefined>
}

export class ENV<T extends ZodEnvObject> {
    private _zod: zod.ZodObject<T>;
    private _example?: zod.infer<zod.ZodObject<T>>;
    private _options: EnvOptions;
    private _error: Error;
    private _root: boolean = true;
    private _extended: boolean = false;
    private _parent?: ENV<ZodEnvObject>;

    constructor(shape: T, example?: zod.infer<zod.ZodObject<T>>, options?: Partial<EnvOptions>) {
        this._zod = zod.object(shape);
        this._example = example;
        this._options =  this.getDefaultOptions(options);
        this._error = new Error()
    }

    public get parent() {
        return this._parent;
    }

    public get root() {
        return this._root;
    }

    public get extended() {
        return this._extended;
    }

    public get example() {
        return this._example;
    }

    public get options() {
        return this._options;
    }

    public get env(): zod.infer<zod.ZodObject<T>> {
        return this.zod.parse(this.filter(process.env));
    }

    private get zod(): zod.ZodObject<T> {
        return zod.object(this._zod.shape);
    }

    public validate(env: zod.infer<zod.ZodObject<T>>) {
        return this.zod.safeParse(env);
    }

    public export<N extends ZodEnvObject>(shape?: N, example?: Partial<zod.infer<zod.ZodObject<T>>> & zod.infer<zod.ZodObject<N>>, options?: Partial<EnvOptions>) {
        const _example = { ...this._example, ...example } as zod.infer<zod.ZodObject<T & N>>
        const env = new ENV({ ...this._zod.shape, ...shape }, _example, { ...this._options, ...options });
        env._error = this._error;
        env._root = false;
        env._extended = true;
        // if shape is empty or undefined extended is false
        if (Object.keys(shape || {}).length === 0) {
            env._extended = false;
        }
        env._parent = this;
        return env
    }

    // generate example .env file
    public exampleFile(): string | undefined {
        if (!this._example) return undefined;
        return this.toFile(this._example);
    }

    public toFile(vars: zod.infer<zod.ZodObject<ZodEnvObject>>) {
        return Object.entries(vars).map(([key, value]) => `${key}=${value}`).join("\n");
    }
    
    // finds .env file in package directory and returns parsed env vars
    // do not use in next.js enviroment
    public getEnvVars(env_file_name: string): zod.infer<zod.ZodObject<ZodEnvObject>> {
        const dir = this.getClassInstaceInfo(this._error).dir;
        return this.filter(prepareEnvVars(`${dir}/${env_file_name}`));
    }

    // filter env vars to only include the ones defined in the zod schema
    public filter(env_vars: zod.infer<zod.ZodObject<ZodEnvObject>>) {
        const vars: zod.infer<zod.ZodObject<ZodEnvObject>> = {}
        for (const key in env_vars) {
            if (this.zod.shape[key]) {
                vars[key] = env_vars[key];
            }
        }
        return vars;
    }

    public getPackage() {
        return this.getFilePackageJson(this.getClassInstaceInfo(this._error).dir);
    }

    private getDefaultOptions(options?: Partial<EnvOptions>): EnvOptions {
        return {
            service: false,
            example: true,
            default: false,
            ...options
        }
    }

    private getFilePackageJson(dir: string): {
        name?: string;
        version?: string;
        description?: string;
    }{
        // get package.json file path
        const packageJsonPath = path.join(dir, "package.json");
        // check if package.json file exists
        if (fs.existsSync(packageJsonPath)) {
            // read package.json file
            const packageJson = fs.readFileSync(packageJsonPath, "utf-8");
            // parse package.json file
            return JSON.parse(packageJson);
        }

        return {};
    }

    private getClassInstaceInfo(error: Error) {
        const stack = error.stack;
        if (!stack) throw new Error("Stack trace is required");
        const stackLines = stack.split('\n');
        
        // find line that contains 
        // linux: "packages/cli/common/env.js"
        // windows: "packages\\cli\\common\\env.js"
        // chose next line
        const linuxLineNum = stackLines.findIndex((line) => line.includes("packages/cli/dist/esm/common/env.js")) + 1;
        const windowsLineNum = stackLines.findIndex((line) => line.includes("packages\\cli\\dist\\esm\\common\\env.js")) + 1;

        // find line number of the caller
        const clineNum = linuxLineNum || windowsLineNum;
        // '    at file:///tsapp/packages/wireguard/dist/esm/configs/env.js:2:26'
        // '    at file:///tsapp\\packages\\wireguard\\dist\\esm\\env.js:2:26'
        const callerLine = stackLines[clineNum]; // The caller is usually the third line in the stack trace

        // extract file path for env.js
        const locationMatch = callerLine.match(/file:\/\/\/(.+):(\d+):(\d+)/);
        if (!locationMatch) throw new Error("Could not extract file path from stack trace");

        // file:///tsapp/packages/wireguard/dist/esm/configs/env.js:2:26
        // remove two :00:00 numbers from the end
        const cleanLocation = locationMatch[0].replace(/:\d+:\d+$/, "").replace("file://", "").replace("file:\\\\", "");
        const dir = path.dirname(cleanLocation).replace("/dist/esm", "");

        if(!fs.existsSync(cleanLocation)) throw new Error(`ENV file not found: ${cleanLocation}`);

        return {
            dir,
            file: cleanLocation,
            package: this.getFilePackageJson(dir)
        }
    }
}