// import { Resources, CountryDocument, CountrySearch, Resolvers, TimeZoneDocument, TimeZoneSearch } from "../../codegen/country"
// import { AccessRequest, GraphqlExport, middleware } from "../../models/user/access"
// import { arraySimilarity, average } from "../../common/util"

// export const resources = {
//     Query: {
//         getCountry: global.tsapp["@ts.app/core"].config.access.Country.getCountry,
//         searchCountry: global.tsapp["@ts.app/core"].config.access.Country.searchCountry,
//         searchTimezone: global.tsapp["@ts.app/core"].config.access.Country.searchTimezone
//     }
// } satisfies Resources<AccessRequest>

// export const resolvers = {
//     Query: {
//         getCountry: async (parent, args, context, info) => {
//             await middleware.graphql( context, resources.Query.getCountry )
//             const alpha2 = args?.alpha2
            
//             if(!alpha2)
//                 throw  `Args, undefined alpha2`

//             for(const country of Object.values(global.tsapp.backend.config.countrys.ALL)) {
//                 if(country.alpha2 == alpha2) {
//                     return country
//                 }
//             }
            
//             throw  `Country not found`
//         },
//         searchCountry: async (parent, args, context, info) => {
//             await middleware.graphql( context, resources.Query.searchCountry )
//             const text = args?.search?.text
//             const score_treshold = 0.5
//             const limit = args?.search?.limit || 10
//             const list = args?.list
//             const _country_entries = Object.entries(global.tsapp.backend.config.countrys)
//             const _country_list = _country_entries.find( ([key, value]) => key == list)?.[1]
//             const country_list = Object.values(_country_list || global.tsapp.backend.config.countrys.ALL) as CountryDocument[]

//             if(!text) { // order by priority and return all countries
//                 return country_list.sort((a, b) => {
//                     const a_priority = a.priority || 0
//                     const b_priority = b.priority || 0
//                     if(a_priority < b_priority) return 1
//                     if(a_priority > b_priority) return -1
//                     return 0
//                 })
//             }

//             // filter by search.find with levenshtein distance
//             const results: CountrySearch[] = []
//             for(const country of country_list) {
//                 if(limit <= results.length) break

//                 if( basicCountrySearch(country, text) ) {
//                     results.push({ ...country, score: 1})
//                     continue
//                 }

//                 const _results = levenshteinCountrySearch(country, text, score_treshold)
//                 results.push(..._results)
//             }

//             // order results
//             const sorted_results = results.sort((a, b) => {
//                 const a_priority = a.priority || 0
//                 const b_priority = b.priority || 0
//                 const a_score = a.score || 0
//                 const b_score = b.score || 0
//                 const a_population = a.population || 0
//                 const b_population = b.population || 0
//                 // order by priority
//                 if(a_priority < b_priority) return 1
//                 if(a_priority > b_priority) return -1
//                 // order by search score
//                 if(a_score < b_score) return 1
//                 if(a_score > b_score) return -1
//                 // order by population
//                 if(a_population < b_population) return 1
//                 if(a_population > b_population) return -1
//                 return 0
//             })

//             // return sorted results
//             return sorted_results
//         },
//         searchTimezone: async (parent, args, context, info) => {
//             await middleware.graphql( context, resources.Query.searchTimezone )
//             const text = args?.search?.text
//             const score_treshold = 0.5
//             const limit = args?.search?.limit || 10
//             const country_list = Object.values(global.tsapp.backend.config.countrys.ALL) as CountryDocument[]

//             if(!text) return global.tsapp.backend.config.countrys.DATA.tz

//             // filter by search.find
//             const timezones: TimeZoneSearch[] = []
//             for(const country of country_list) {
//                 const checkLimit = () => {
//                     if(limit <= timezones.length) return true
//                     return false
//                 }

//                 const pushTimezones = (tz: TimeZoneDocument | TimeZoneSearch, score?: number) => {
//                     if(checkLimit()) return
//                     const exists = timezones.find( (_tz)=> _tz.name == tz.name )
//                     if(exists) return
//                     timezones.push({score, ...tz})
//                 }

//                 //if(checkLimit()) break

//                 // basic timezone find
//                 for(const tz of country.timezones) {
//                     if( basicTimezoneSearch(tz, text) ) {
//                         pushTimezones(tz, 1)
//                         continue
//                     }
//                 }

//                 // basic timezone find by country
//                 if( basicCountrySearch(country, text) ) {
//                     for(const tz of country.timezones) {
//                         pushTimezones(tz, 1)
//                     }
//                     continue
//                 }

//                 // levenshtein timezone find
//                 const _timezone_results = levenshteinTimezoneSearch(country.timezones, text, score_treshold)
//                 for(const result of _timezone_results) {
//                     pushTimezones(result)
//                 }

//                 // levenshtein timezone find by country
//                 const _results = levenshteinCountrySearch(country, text, score_treshold)
//                 if(_results.length) {
//                     for(const result of _results) {
//                         for(const tz of country.timezones) {
//                             const _score = (result.score)? result.score * 0.6: 0
//                             if(_score > score_treshold) pushTimezones(tz, _score)
//                         }
//                     }
//                 }
//             }

//             // order results
//             const sorted_results = timezones.sort((a, b) => {
//                 const a_score = a.score || 0
//                 const b_score = b.score || 0
//                 // order by search score
//                 if(a_score < b_score) return 1
//                 if(a_score > b_score) return -1
//                 return 0
//             })

//             return sorted_results
//         }
//     }
// } satisfies Resolvers<AccessRequest>

// export default {
//     resources,
//     resolvers
// } satisfies GraphqlExport<Resources<AccessRequest>, Resolvers<AccessRequest>>


// function basicCountrySearch(country: CountryDocument, search: string): boolean {
//     const search_upper = search.toUpperCase()
//     return (
//         country.alpha2 == search_upper || 
//         country.alpha3 == search_upper || 
//         country.name.toUpperCase() == search_upper ||
//         country.phone == search_upper
//     )
// }

// function basicTimezoneSearch(tz: TimeZoneDocument, tz_name: string): boolean {
//     const search_lower = tz_name.toLowerCase()
//     const tz_lower = tz.name.toLowerCase()
//     return ( tz_lower == search_lower )
// }

// function levenshteinCountrySearch(country: CountryDocument, search: string, treshold: number): CountrySearch[] {
//     const results: CountrySearch[] = []

//     // levenstein distance search
//     const _search = search.split(' ')
//     const _names = country.name.split(' ')
//     const _sim = arraySimilarity(_search, _names, treshold)

//     // push result if _sim_average reaches treshold treshold
//     const _sim_average = _sim.length / _names.length
//     if(_sim_average >= treshold) {
//         results.push({ ...country, score: average(_sim) })
//     }

//     return results
// }

// function levenshteinTimezoneSearch(tz: TimeZoneDocument[], search: string, treshold: number): TimeZoneSearch[] {
//     const results: TimeZoneSearch[] = []

//     for(const timezone of tz) {
//         // levenstein distance search
//         const _search = search.split(' ')
//         const _names = timezone.name.split('/')
//         const _sim = arraySimilarity(_search, _names, treshold)
        
//         // push result if _sim_average reaches treshold treshold
//         const _sim_average = _sim.length / _names.length
//         if(_sim_average >= treshold) {
//             results.push({ ...timezone, score: average(_sim) })
//         }
//     }

//     return results
// }