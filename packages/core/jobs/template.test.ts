import { beforeAll, describe, it, expect } from "vitest"
import { TemplateJobDocument, TemplateJobInput, TemplateJobModel, discriminator } from "@ts.app/core/jobs/template.js"
import { CronJobDoc } from "@ts.app/core/common/job.js"
import { JobActionModel } from "@ts.app/core/models/job.js"
import { LogModel } from "@ts.app/core/models/log.js"
import { Types } from "mongoose"

import { setup, Setup } from "@ts.app/core/common/test/setup.js"
var core_tsapp_test: Setup = {} as any
beforeAll(async () => core_tsapp_test = await setup())

describe(`Test job type ${discriminator}`, () => {
    const job_id = "63281deb77824ea0ca9190fb"
    let job_input: TemplateJobInput
    let job: CronJobDoc

    it('should clean up old data', async () => {
        await TemplateJobModel.deleteOne({_id: job_id})

        job_input = {
            status: "Active",
            description: "Test template job",
            run_on_startup: false,
            data: undefined,
            log: { enabled: true, max: 1 },
            params: {
                sender: {
                    email: "test@email.com",
                    name: "Test Sender"
                },
                template: "Hi {{name}}, this is a test email."
            },
            created_by: core_tsapp_test.root_user._id,
            updated_by: core_tsapp_test.root_user._id,
        } satisfies TemplateJobInput
    })

    it(`should prepeare job input data`, async () => {
        await TemplateJobModel.findOneAndUpdate(
            {_id: job_id},
            {_id: job_id, ...job_input},
            {upsert: true, new: true}
        )
    })

    it('should have template job in db', async () => {
        const test_job = await TemplateJobModel.findOne({_id: job_id})
        expect(test_job).not.to.be.null
    })

    it('should add job to job list', async () => {
        const test_job = await TemplateJobModel.findOne({_id: job_id})
        if(!test_job) throw "Job not found"
        job = await core_tsapp_test.jobs.add(test_job)
    })

    it('should execute job callback', async () => {
        await job.onTick()
        const test_job = await TemplateJobModel.findOne({parent_id: job_id})
        expect(test_job).not.to.be.null
    })

    it('should get template job actions with step status: "Executed"', async () => {
        const test_job = await TemplateJobModel.findOne({parent_id: job_id})
        if(!test_job) throw "Job not found"

        const actions = await JobActionModel.findOne({job_id: test_job._id})
        if(!actions) throw "Job action not found"
        
        expect(actions.steps).not.to.be.null
        expect(actions.steps.length).to.be.greaterThan(0)

        for(const step of actions?.steps || []) {
            expect(step.status).to.be.equal("Executed")
        }
    })

    it('should get child job with status Success', async () => {
        const test_job = await TemplateJobModel.findOne({parent_id: job_id})
        if(!test_job) throw "Job not found"
        expect(test_job.status).to.be.equal("Success")
    })

    it('should log job update', async () => {
        // get log by doc._id = job_id
        var log = await LogModel.findOne({'doc._id': new Types.ObjectId(job_id)})
        if(!log) throw "Log not found"
        var doc = log.doc as TemplateJobDocument

        // compare log doc with job
        expect(doc._id.toString()).to.be.equal(job_id)
        expect(doc.params.sender.email).to.be.equal(job_input.params.sender.email)

        // update job
        var job = await TemplateJobModel.findOne({_id: job_id})
        if(!job) throw "Job not found"
        job.params = {
            sender: {
                email: "test",
                name: "test"
            },
            template: "test"
        }
        await job.save()

        // get log by doc._id = job_id
        log = await LogModel.findOne({'doc._id': new Types.ObjectId(job_id)})
        if(!log) throw "Log not found"
        doc = log.doc as TemplateJobDocument
        
        // compare log doc with job
        expect(doc._id.toString()).to.be.equal(job_id)
        expect(doc.params.sender.email).to.be.equal(job.params.sender.email)

        // total logs should be 1
        const logs = await LogModel.find({'doc._id': new Types.ObjectId(job_id)})
        expect(logs.length).to.be.equal(1)
    })
})