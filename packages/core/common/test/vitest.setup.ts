import { TypeStack } from "@ts.app/core";

if(!globalThis.type_stack) {
    globalThis.type_stack = await TypeStack.init();
}else{
    await TypeStack.init({
        config: globalThis.type_stack
    })
}