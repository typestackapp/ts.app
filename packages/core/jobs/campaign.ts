import { ObjectId } from 'mongodb'
import { Email, EmailInput, EmailOptions } from '@ts.app/core/common/email.js'
import { Model, Schema } from "mongoose"
import { JobDocument, JobInput, JobModel, JobStepInput } from "@ts.app/core/models/job.js"
import { InteractionType, Template } from "@ts.app/core/common/template.js"
import { ChannelConfigDocument, ChannelConfigModel } from "@ts.app/core/models/config/channel.js"

export const pack = "@ts.app/core"
export const type = "MessageCampaign"
export const discriminator = `${pack}:${type}`

export type Interaction = {
    [key in InteractionType]?: TemplateRef[]
}

export type TemplateRef = {
    next_step: string // next step key reference, first step will always be with "0"!
    delay?: string // 1h | 2d delay after next email is going to be sent
}

export interface TemplateParams {
    id: string
    channel_id: string
    type: string
    subject: string
    from?: {
        name?: string
        address?: string
    }
    url?: string
    html?: string
}

export interface CampaignTemplates extends TemplateParams {
    template: Template<any>
    channel_config: ChannelConfigDocument
}

export type ReceiverParams = {
    external_id?: string
    email?: string[],
    sms?: string[],
    template_input: { [key: string]: any }
}

export type StepParams = {
    id: string
    is_first?: boolean
    template_id: string
    actions?: Interaction
}

export type Step = {
    template_type: string
    template_input: { [key: string]: any }
    external_id?: string | number
}

export interface JobParams {
    templates: TemplateParams[]
    steps: StepParams[]
    inputs: ReceiverParams[]
}

export interface CampaignInput extends JobInput<JobParams> {}

export interface CampaignDocument extends JobDocument<JobParams> {
    type: typeof type
    pack: typeof pack
}

const campaignSchema = new Schema<CampaignDocument, Model<CampaignDocument>, CampaignDocument>({
    pack: { type: String, required: true, index: true, default: pack, immutable: true },
    type: { type: String, required: true, index: true, default: type, immutable: true },
    params: {
        templates: { type: [Schema.Types.Mixed], required: true, index: true },
        steps: { type: [Schema.Types.Mixed], required: true, index: true },
        inputs: { type: [Schema.Types.Mixed], required: true, index: true },
    }
})

campaignSchema.methods.onTick = async function(){
    // TODO
    // prepeare data
    // call producer(data)
    return void 0
    producer(this)
}

export async function producer(job: CampaignDocument) {
    const params = job.params
    // Validate incoming data
    if(!params?.inputs)
        throw  "Params.input not defined"

    // CHECK TEMPLATES AND DOWNLOAD THEM
    if( !params?.steps ) throw  "Steps was not found or could not create one"
    if( !params?.templates ) throw  "Templates was not found or could not create one"
    
    // prepare templates
    const templates: CampaignTemplates[] = []
    const templates_to_save: TemplateParams[] = []

    for(const template of params.templates) {
        if( !template.id && !template.url && !template.html ) throw  "Template data does not exist"
        
        var _tpl: Template<any>
        if( template?.html ) { // template is provided via html
            _tpl = new Template(template.html)
        }else if( !template?.html && template?.url ) { // donwload template via url
            _tpl = await Template.download(template.url)
        }else {
            throw  "Currently supported is only templates by url and html document"
        }

        const channel_config = await ChannelConfigModel.findOne({ _id: new ObjectId(template.channel_id) })
        if( !channel_config ) 
            throw  "Template channel confg not found!"

        
        const tpl = _tpl
        templates_to_save.push({ ...template, html: tpl.template })
        templates.push({ ...template, channel_config, template: tpl })
    }

    // SEND FIRST TEMPLATE AND ADD ALL STEPS
    for await(const input of params.inputs) {
        const action = await job.action()
        for await(const step of params.steps) {
            const tpl = templates.find(t => t.id == step.template_id)
            if( !tpl ) break

            const new_step: JobStepInput<Step> = {
                identifier: step.id,
                status: "Initilized",
                data: {
                    external_id: input.external_id,
                    template_input: input.template_input,
                    template_type: tpl.type,
                }
            }

            if( !input?.email?.length ) {
                new_step.error = "Email receiver does not exist"
                new_step.status = "Error"
                action.steps.push(new_step)
                break
            }
            
            // PREPEARE FIRST STEP
            if( step.is_first ) {
                if( tpl.type == "Email" ) {

                    const email_options: EmailOptions = {
                        external_id: input.external_id,
                        step: {
                            action_id: action._id,
                            step_identifier: new_step.identifier,
                        }
                    }

                    const email_input: EmailInput = {
                        receivers: input.email,
                        subject: tpl.subject,
                        from: tpl.from,
                        html: tpl.template.render(input.template_input),
                        attachments: []
                    }

                    const email = new Email(email_input, email_options)
                    await email.sendToQueue(tpl.channel_config)

                    .then(() => {
                        new_step.status = "InQueue"
                    })
                    .catch(err => {
                        new_step.error = err
                        new_step.status = "Error"
                    })

                }else {
                    // TODO, sendSmsToQueue etc
                    throw  "not yet implemented"
                }
            }else {
                // TODO, add new steps to action
                throw  "not yet implemented"
            }

            action.steps.push(new_step)
        }

        action.markModified('steps')
        await action.save()
    }

    job.params = {
        templates: templates_to_save,
        steps: params.steps,
        inputs: params.inputs
    }

    await job.save()
}

export const CampaignModel = JobModel.discriminator(discriminator, campaignSchema)