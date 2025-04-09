import { TypeStack } from "@ts.app/core"

await TypeStack.init({
    start_jobs: true
})
.finally(() => {
    // CONSOLE LOG SERVER INFO
    console.log(`------------------JOBS SERVER INFO---------------------`)
    console.log(`SERVER :  JOBS initilized`)
    console.log(`-------------------------------------------------------`)
})