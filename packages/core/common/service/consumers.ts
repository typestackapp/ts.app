import { TypeStack } from "@ts.app/core"

await TypeStack.init({
    start_rmq_consumers: true
})
.finally(() => {
    // CONSOLE LOG SERVER INFO
    console.log(`------------------CONSUMER SERVER INFO---------------------`)
    console.log(`SERVER :  CONSUMERS initilized`)
    console.log(`-------------------------------------------------------`)
})