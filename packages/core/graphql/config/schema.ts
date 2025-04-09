import { MongoTimeStamps, Pagination, SearchScore } from '@ts.app/core/graphql/common/schema.js'

export const ConfigBase = `
    _id: ObjectId
    title: String!
    created_by: ObjectId!
    updated_by: ObjectId!
`

export const ConfigDocumentBase = `
    log: LogOptionsDocument!
    pack: Packages!
    type: String!
`

export const schema = `#graphql
    extend type Query {
        getConfig(id: String!): ConfigOutput
        searchConfigs(search: SearchInput!): ConfigPagination
    }

    extend type Subscription {
        streamConfig(stream: MongoStreamInput!): MongoStream
    }
    
    type ConfigBase {
        data: Object
        ${ConfigBase}
    }

    type ConfigDocumentBase {
        ${ConfigDocumentBase}
    }

    type ConfigInput {
        data: Object
        log: LogOptionsInput
        ${ConfigBase}
    }

    type ConfigDocument {
        data: Object
        ${ConfigDocumentBase}
        ${ConfigBase}
    }

    type ConfigOutput implements MongoTimeStamps {
        data: Object
        ${ConfigDocumentBase}
        ${ConfigBase}
        ${MongoTimeStamps}
    }

    type ConfigSearch implements SearchScore & MongoTimeStamps {
        data: Object
        ${ConfigDocumentBase}
        ${ConfigBase}
        ${MongoTimeStamps}
        ${SearchScore}
    }

    type ConfigPagination implements Pagination {
        list: [ConfigSearch!]!
        ${Pagination}
    }
`