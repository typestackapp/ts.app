import { graphql } from '@ts.app/dev/codegen/system/client/index.js'
import { useQuery } from "@apollo/client"

export { useQuery }

export const getPingInComponent = graphql(`#graphql
    query getPingInComponent {
        getPing
    }
`)