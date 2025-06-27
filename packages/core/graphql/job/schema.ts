import { MongoTimeStamps, MongoId, Pagination, SearchScore } from '@ts.app/core/graphql/common/schema.js'

export const JobBase = `
    data: Object
    cron: String
    parent_id: ObjectId
    description: String!
    status: JobStatus!
    params: Object!
    created_by: ObjectId!
    updated_by: ObjectId!
`

export const JobInput = `
    ${JobBase}
    # overrides defaults
    time_zone: String
    run_on_startup: Boolean
    log: LogOptionsInput
`

export const JobDocument = `
    ${JobBase}
    # auto generated
    pack: Packages!
    type: String!
    error: String

    # defaults
    time_zone: String! # default: "UTC"
    run_on_startup: Boolean! # default: false
    log: LogOptions!
`

export const JobActionInput = `
    job_id: ObjectId
    steps: [JobStepInput!]!
`

export const JobStepInput = `
    identifier: String!
    status: JobStepStatus!
    data: Object!
    error: String
`

export default `#graphql
    extend type Query {
        getJob(id: String!): JobDocument
        searchJob(search: SearchInput): JobPagination
    }

    extend type Subscription {
        streamJob(stream: MongoStreamInput!): MongoStream
        streamJobAction(stream: MongoStreamInput!): MongoStream
    }

    interface JobBase {
        ${JobBase}
    }

    interface JobInput implements JobBase {
        ${JobInput}
    }

    type JobDocument implements JobBase & MongoId & MongoTimeStamps {
        ${MongoId}
        ${JobDocument}
        ${MongoTimeStamps}
    }

    type JobSearch implements SearchScore & JobInput & JobBase & MongoId & MongoTimeStamps {
        ${MongoId}
        ${JobInput}
        ${MongoTimeStamps}
        ${SearchScore}
    }

    type JobPagination implements Pagination {
        list: [JobSearch!]!
        ${Pagination}
    }

    # JOB ACTION
    interface JobActionInput {
        ${JobActionInput}
    }

    type JobActionDocument implements JobActionInput & MongoId & MongoTimeStamps {
        ${MongoId}
        ${JobActionInput}
        ${MongoTimeStamps}
    }

    interface JobStepInput {
        ${JobStepInput}
    }

    type JobActionSearch implements SearchScore & JobActionInput & MongoId & MongoTimeStamps {
        ${MongoId}
        ${JobActionInput}
        ${MongoTimeStamps}
        ${SearchScore}
    }

    type JobActionPagination implements Pagination {
        list: [JobActionSearch!]!
        ${Pagination}
    }

    enum JobStepStatus {
        Initilized
        InQueue
        Executed
        Error
    }

    enum JobStatus {
        Active # job is active and will produce copy of itself
        Disabled # job is disabled and will not start
        Initilized # job produced copy of itself and started provided callback()
        Error # job produced copy of itself and started provided callback() but callback() throwed an error
        Success # job produced copy of itself and started provided callback() and callback() finished without errors
    }
`