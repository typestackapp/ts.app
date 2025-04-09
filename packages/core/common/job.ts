
import { CronJob } from 'cron'
import { Model, Types } from "mongoose"
import { JobDocument, JobInput, JobModel } from "@ts.app/core/models/job.js"

interface MongoCronJob extends JobDocument<any> {
    type: any
    pack: any
}

export class CronJobDoc {
    private doc: JobDocument<any>
    private cron: CronJob<null, this> | undefined

    constructor(doc: JobDocument<any>) {
        this.doc = doc
        this.setCron(this.doc)
        return this
    }

    private setCron(doc: { run_on_startup?: boolean, cron?: string | null, time_zone?: string }) {
        if(!doc.cron) {
            if(doc.run_on_startup) this.onTick()
            return this.cron = undefined
        }

        this.cron = new CronJob(
            doc.cron,
            this.onTick,
            null,
            true,
            doc.time_zone,
            this,
            doc.run_on_startup
        )
    }

    public stop() {
        if(!this.cron) throw "Can't stop job without cron instance"
        this.cron.stop()
    }
    
    public restart() {
        this.stop()
        this.cron = this.setCron(this.doc)
    }

    public getDoc() {
        return this.doc
    }

    public async onTick() {
        // create copy of job and start callback
        const job_input: JobInput<any, any> = {
            status: "Initilized",
            parent_id: this.doc._id,
            log: { enabled: false },
            params: this.doc.params,
            data: this.doc.data,
            description: this.doc.description,
            time_zone: this.doc.time_zone,
            run_on_startup: false,
            created_by: this.doc.created_by,
            updated_by: this.doc.updated_by
        }

        const TypedJobModel = this.getJobModel(this.doc.pack, this.doc.type)
        const typedJob = new TypedJobModel(job_input)
        await typedJob.save()

        try {
            if(this.doc.status == "Disabled") throw "Job is disabled"
            await typedJob.onTick()
            typedJob.status = "Success"
        } catch (error) {
            console.log(`Error, in Job, pack: ${this.doc.pack}, type: ${this.doc.type}, error msg: ${error}`)
            typedJob.status = "Error"
            typedJob.error = `${error}`
        }

        await typedJob.save()
    }

    public getJobModel(pack: string, type: string) {
        if(!JobModel?.discriminators) throw `Error, JobModels are not initialized!`
        const model = JobModel.discriminators[`${pack}:${type}`] as Model<JobDocument<any>>
        if(!model) throw `Error, JobModel with pack: ${pack}, type: ${type} does not exist!`
        return model
    }
}

export class JobList {
    public static readonly query = { status: "Active" }
    private static instance: JobList
    public list: CronJobDoc[] = []

    public static async getInstance(load: boolean = false): Promise<JobList> {
        if (JobList.instance) return JobList.instance
        JobList.instance = new JobList()
        if(!load) return JobList.instance

        await JobModel
        .find(JobList.query)
        .cursor()
        .eachAsync(async (doc) => {
            await JobList.instance.add(doc)
            .catch((err) => console.log(`Error, error while adding new job with id: ${doc._id}, error msg: ${err}`))
        })

        return JobList.instance
    }

    public async add( _job: MongoCronJob ): Promise<CronJobDoc> {
        // CHECK IF JOB ALREADY EXISTS
        if( this.get(_job._id) ) throw `Error, JOB: ${_job._id}, already exists!`

        // CREATE NEW JOB
        const new_job = new CronJobDoc(_job)

        // INSERT NEW JOB
        this.list.push( new_job ); 

        return new_job;
    }

    public get( jobId: Types.ObjectId ): CronJobDoc | null {
        for(const index in this.list) {
            var job = this.list[index];
            if(job.getDoc()._id.equals(jobId)){
                return job;
            }
        }
        return null;
    }

    public stop( jobId: Types.ObjectId ): boolean {
        const job = this.get(jobId)
        if(job) {
            job.stop()
            this.remove(jobId)
            return true
        }
        return false
    }

    private remove( jobId: Types.ObjectId ) {
        for(let i = 0; i < this.list.length; i++ ) {
            const job = this.list[i];
            if(job.getDoc()._id.equals(jobId)){
                this.list.splice(i, 1)
                return;
            }
        }
    }
}