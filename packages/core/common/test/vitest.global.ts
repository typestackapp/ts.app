import { TypeStack } from "@ts.app/core";

export const setup = async () => {
    if(!globalThis.type_stack) {
        globalThis.type_stack = await TypeStack.init();
    }else{
        await TypeStack.init({
            config: globalThis.type_stack
        })
    }
}