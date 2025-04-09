import gql from 'graphql-tag'

// client queries 
export const getPingInSchema = gql`
    query getPingInSchema($ping: String!) {
        getPing
    }
`

// graphql schema
export default `#graphql
    extend type Query {
        getPing: Boolean
    }

    extend type Mutation {
        getPing: Boolean
    }

    extend type Subscription {
        getPing: Boolean
    }
`