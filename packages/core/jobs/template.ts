import { Model, Schema } from "mongoose"
import { JobDocument, JobInput, JobModel, JobStepInput } from "@ts.app/core/models/job.js"

export const pack = "@ts.app/core"
export const type = "TemplateJob"
export const discriminator = `${pack}:${type}`

export type JobParams = {
    sender: {
        email: string
        name: string
    },
    template: string
}

export interface MyStep1 {
    receivers: string[]
}

export interface TemplateJobInput extends JobInput<JobParams> {}

export interface TemplateJobDocument extends JobDocument<JobParams> {
    type: typeof type
    pack: typeof pack
}

const templateJobSchema = new Schema<TemplateJobDocument, Model<TemplateJobDocument>, TemplateJobDocument>({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    params: {
        sender: {
            email: { type: String, required: true },
            name: { type: String, required: true },
        },
        template: { type: String, required: true },
    }
})

templateJobSchema.methods.onTick = async function() {
    // create new action for job snapshot
    const action = await this.action()

    // create new step for action
    const step: JobStepInput<MyStep1> = {
        identifier: "console-log-template",
        status: "Initilized",
        data: { receivers: ["test@test.com"] }
    }

    // save new step into action
    action.steps.push(step)
    await action.save()

    // execute producer step
    await myStep1(this.params, step)
    .then(() => {
        const step_update = action.getStep(step.identifier)
        if (step_update){
            step_update.status = "Executed"
        }
    })
    .catch(err => {
        const step_update = action.getStep(step.identifier)
        if (step_update) {
            step_update.status = "Error"
            step_update.error = `${err}`
        }
    })

    // save step changes
    await action.save()

    // ... create more actions and steps
}

export async function myStep1(params: JobParams, step: JobStepInput<MyStep1>) {
    /*
        send email to receivers
        console.log(`Template: ${JSON.stringify(params)}`)
        console.log(`Template receivers: ${JSON.stringify(step.data.receivers)}`)

        creating long runnning jobs is not recommended
        if you need to create a long running job, you should use a queue system like rabbitmq
        producer should push messages to a queue and consumer should process messages from the queue
    */
}

export const TemplateJobModel = JobModel.discriminator(discriminator, templateJobSchema)