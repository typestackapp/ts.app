
        import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
        import { setContext } from '@apollo/client/link/context'
        import TSAppClient from "@ts.app/core/models/user/app/oauth/client/tsapp.js"
        export function getGraphqlClients(tsc: TSAppClient) {
            return {
                
                "system": 
            new ApolloClient({
                cache: new InMemoryCache(),
                link: setContext(async (_, { headers }) => {
                    if(true){
                        return headers
                    } else {
                        const auth_headers = await tsc.getAuthHeaders()
                        return {
                            headers: {
                                ...headers,
                                ...auth_headers,
                            }
                        }
                    }
                }).concat(createHttpLink({
                    uri: "/graphql/@ts.app/dev/system/" // "https://localhost:7443/graphql/@ts.app/core/system/"
                }))
            })
        ,
            
            }
        }

        export type GraphqlClients = ReturnType<typeof getGraphqlClients>
    