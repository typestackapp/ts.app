import { MongoId, MongoIdMeybe, MongoTimeStamps } from "@ts.app/core/graphql/common/schema.js"

export const UserInput = `
    usn: String!
    psw: String!
    roles: [String!]!
`

export default `#graphql
    interface UserInput implements MongoIdMeybe {
        ${UserInput}
        ${MongoIdMeybe}
    }

    type UserDocument implements MongoId & MongoTimeStamps {
        ${UserInput}
        ${MongoId}
        ${MongoTimeStamps}
    }

    type UserOutput implements MongoId & MongoTimeStamps {
        usn: String!
        roles: [RoleConfigDocument!]
        ${MongoId}
        ${MongoTimeStamps}
    }
`

export const getCurrentUser = `#graphql
    extend type Query {
        getCurrentUser: UserOutput
    }
`

export const getUser = `#graphql
    extend type Query {
        getUser(id: String!): UserOutput
    }
`