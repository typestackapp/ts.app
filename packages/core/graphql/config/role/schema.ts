import { ConfigBase, ConfigDocumentBase } from "@ts.app/core/graphql/config/schema.js"
import { MongoTimeStamps } from "@ts.app/core/graphql/common/schema.js"

export const schema = `#graphql
    extend type Query {
        getAllRoles: [RoleConfigDocument!]
    }
    
    type GraphqlAccess {
        pack: Packages!
        services: [String!]!
    }

    type RoleConfigDataInput {
        name: String!
        resource_access: [AccessInput!]!
        graphql_access: [GraphqlAccess!]!
    }

    type RoleConfigDataDocument {
        name: String!
        resource_access: [AccessDocument!]!
        graphql_access: [GraphqlAccess!]!
    }

    type RoleConfigInput {
        ${ConfigBase}
        log: LogOptionsInput
        data: RoleConfigDataInput!
    }

    type RoleConfigDocument implements MongoTimeStamps {
        ${ConfigBase}
        ${ConfigDocumentBase}
        ${MongoTimeStamps}
        data: RoleConfigDataDocument!
    }
`