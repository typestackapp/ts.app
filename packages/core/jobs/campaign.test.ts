import { beforeAll, describe, it, expect } from "vitest"
import { CampaignDocument, CampaignInput, CampaignModel, JobParams, producer, discriminator } from "@ts.app/core/jobs/campaign.js"
import { sleep } from "@ts.app/core/common/util.js"
import { Types } from "mongoose"
import { JobActionModel } from "@ts.app/core/models/job.js"
import tscore from "@ts.app/core"

import { setup, Setup } from "@ts.app/core/common/test/setup.js"
var core_tsapp_test: Setup = {} as any
beforeAll(async () => core_tsapp_test = await setup())

describe(`Test job type: ${discriminator}`, () => {
    var job: CampaignDocument
    var job_id = "63281deb77824ea0ca9190fa"

    it('should clean up old data', async () => {
        await CampaignModel.deleteOne({_id: job_id})
    })

    it('should create new job', async () => {
        const job_params: JobParams = {
            "templates": [
                {
                    "channel_id": "63453a61fe9cd72c40188adf",
                    "id": "template1",
                    "subject": "test subject",
                    "type": "Email",
                    "url": "https://httpbin.org/get",
                },
                {
                    "channel_id": "63453a61fe9cd72c40188adf",
                    "id": "template2",
                    "subject": "test subject",
                    "type": "Email",
                    "html": "<h1>Hi %{UNSUBSCRIBE_HASH}% </h1>"
                }
            ],
            "steps": [
                {
                    "id": "step1",
                    "is_first": true,
                    "template_id": "template1"
                }
            ],
            "inputs": [
                {
                    "external_id": "campaign-test-120",
                    "email": tscore.config.system.DEV_EMAIL,
                    "template_input": {
                        "UNSUBSCRIBE_HASH": "#000001",
                        "TASKS": [{"name": "test1"}, {"name": "test2"}]
                    }
                },
                {
                    "external_id": "campaign-test-121",
                    "email": tscore.config.system.DEV_EMAIL,
                    "template_input": {
                        "UNSUBSCRIBE_HASH": "#000002",
                        "TASKS": [{"name": "test3"}, {"name": "test4"}]
                    }
                },
                {
                    "external_id": "campaign-test-122",
                    "email": tscore.config.system.DEV_EMAIL,
                    "template_input": {
                        "UNSUBSCRIBE_HASH": "#000003",
                        "TASKS": [{"name": "test3"}, {"name": "test4"}]
                    }
                },
                {
                    "external_id": "campaign-test-123",
                    "email": tscore.config.system.DEV_EMAIL,
                    "template_input": {
                        "UNSUBSCRIBE_HASH": "#000004",
                        "TASKS": [{"name": "test3"}, {"name": "test4"}]
                    }
                },
                {
                    "external_id": "campaign-test-124",
                    "email": tscore.config.system.DEV_EMAIL,
                    "template_input": {
                        "UNSUBSCRIBE_HASH": "#000003",
                        "TASKS": [{"name": "test3"}, {"name": "test4"}]
                    }
                },
                {
                    "external_id": "campaign-test-125",
                    "email": tscore.config.system.DEV_EMAIL,
                    "template_input": {
                        "UNSUBSCRIBE_HASH": "#000004",
                        "TASKS": [{"name": "test3"}, {"name": "test4"}]
                    }
                }
            ]
        }

        const job_input: CampaignInput = {
            _id: new Types.ObjectId(job_id),
            status: "Initilized",
            description: "Test campaign job",
            data: undefined,
            params: job_params,
            created_by: core_tsapp_test.root_user._id,
            updated_by: core_tsapp_test.root_user._id,
            log: { enabled: false, max: 0 },
        }

        job = await CampaignModel.create(job_input)
        await producer(job)
    })
    
    it('should have all emails sent via rabbitmq Email consumer queue', async () => {
        await sleep(1)
        const actions = await JobActionModel.find({ job_id: job._id })
        for(const action of actions) {
            expect(action.steps.length).to.be.equal(1)
            expect(action.steps[0].status).to.be.equal("Executed")
        }
    })
})