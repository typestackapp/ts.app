import { producer, JobParams, CampaignInput, CampaignModel } from "@ts.app/core/jobs/campaign.js"
import tscore, { ExpressResponse, ExpressRouter } from "@ts.app/core"
import { Types } from "mongoose"

export const router = new ExpressRouter<{
    post: { res: ExpressResponse<{id: string}>, body: Partial<JobParams> }
}>()

router.post = {
    access: tscore.config.access.MessagingCampaign.createMessagingCampaignJob,
    resolve: async (req, res) => {
        if(!req.user) throw "User not found"

        const user = req.user
        const val = req.body
        const template_types: string[] = ["Email", "Sms"]
        const _templates = val?.templates

        // INPUT DATA VALIDATION
        if( !_templates || _templates.length == 0 )
            return res.json({error: { code: "invalid-template", msg: "Should provide one template or more templates"}})

        for(const template of _templates){
            if( !template?.url && !template?.html)
                return res.json({error: { code: "invalid-template", msg: "Invalid template data"}})

            if( !template?.type )
                return res.json({error: { code: "invalid-template", msg: "Null template type"}})
            
            if( !template_types.includes(template.type) )
                return res.json({error: { code: "invalid-template", msg: `Invalid template type: ${template.type.toString()}`}}) 
        }

        if( !val?.inputs )
            return res.json({error: { code: "invalid-input", msg: "Invalid Input data"}})

        if( !val?.steps )
            return res.json({error: { code: "invalid-steps", msg: "Invalid Steps data"}})

        const new_params: JobParams = {
            templates: _templates,
            steps: val.steps,
            inputs: val.inputs
        }

        const new_campaign: CampaignInput = {
            _id: new Types.ObjectId(),
            created_by: user._id,
            updated_by: user._id,
            status: "Initilized",
            params: new_params,
            data: undefined,
            description: "Campaign job created via REST API",
            log: { enabled: false, max: 0 },
        }

        const campaign = await CampaignModel.create(new_campaign)

        try {
            await producer(campaign)
            res.json({data:{ id:campaign._id.toString() }})
        }catch(error) {
            campaign.status = "Error"
            campaign.error = `${error}`
            await campaign.save()
            res.json({error: {code: "error", msg: `${error}`}})
        }
    }
}