import { GraphqlRouter } from '@ts.app/core/common/service.js'
import { Pagination, SearchScore } from '@ts.app/core/graphql/common/schema.js'

export const CountryInput = `
    name: String! # United States of America
    alpha2: String! # USA
    alpha3: String! # US
    phone: String! # 1-684
    population: Int
    area: Int # km2
    gdp: String # 2.516 Billion, 175.4 Million
    priority: Int # country order
`

export const CountryDocument = `
    ${CountryInput}
    timezones: [TimeZoneDocument!]!
`

export const TimeZoneInput = `
    alpha2: String # "KE, DJ, ER, ET, KM, MG, SO, TZ, UG, YT"
    name: String! # America/New_York
    std: String! # -05:00
    dst: String! # -04:00
`

export const TimeZoneDocument = `
    ${TimeZoneInput}
`

export default `#graphql
    extend type Query {
        getCountry(alpha2: String!): CountryDocument
        searchCountry(search: SearchInput, list: String): [CountrySearch!]!
        searchTimezone(search: SearchInput): [TimeZoneSearch!]!
    }

    # COUNTRY TYPES
    input CountryUpdate {
        ${GraphqlRouter.deepOptional(CountryInput)}
    }

    interface CountryInput {
        ${CountryInput}
    }

    type CountryDocument implements CountryInput {
        ${CountryDocument}
    }

    type CountrySearch implements SearchScore {
        ${CountryDocument}
        ${SearchScore}
    }

    type CountryPagination implements Pagination {
        list: [CountrySearch!]!
        ${Pagination}
    }

    # TIMEZONE TYPES
    interface TimeZoneInput {
        ${TimeZoneInput}
    }

    type TimeZoneDocument implements TimeZoneInput {
        ${TimeZoneDocument}
    }

    type TimeZoneSearch implements SearchScore {
        ${TimeZoneDocument}
        ${SearchScore}
    }

    type TimeZonePagination implements Pagination {
        list: [TimeZoneSearch!]!
        ${Pagination}
    }
`

export const queries = `#graphql
    query GetCountry($alpha2: String!) {
        getCountry(alpha2: $alpha2) {
            alpha2
            alpha3
            area
            gdp
            name
            phone
            population
            priority
            timezones {
            alpha2
            dst
            name
            std
            }
        }
    }

    query GetCountryMin($alpha2: String!) {
        getCountry(alpha2: $alpha2) {
            alpha2
            phone
            name
            timezones {
            name
            dst
            std
            }
        }
    }
`