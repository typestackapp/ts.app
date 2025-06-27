export const Pagination = `
    total: Int
`

export const SearchScore = `
    score: Float
`

export const MongoId = `
    _id: ObjectId!
`

export const MongoIdMeybe = `
    _id: ObjectId
`

export const MongoTimeStamps = `
    createdAt: DateTime!
    updatedAt: DateTime!
`
export const MongoTimeStampsMeybe = `
    createdAt: DateTime
    updatedAt: DateTime
`

export const ServerAccess = `
    path: [String!]!
    serverType: ServerType!
    serverMethod: ServerMethod!
`

export const Enabled = `
    enabled: Boolean!
`

export const EnabledMeybe = `
    enabled: Boolean
`

export const DefaultAccessOptions = `
    pack: Packages! # package name
    resource: String # used in checkAccess() to check if user has access to resource
    action: String # any string value used to namespace AccessOptions
    resourceAction: String! # resource and action names combined
`

export const AuthOptions = `
    authParamKeyName: String # if defined will use req.params[authParamKeyName] as Authorization key
    tokens: [TokenType!]! # token types: ApiKey | Bearer | Basic, default: Bearer
`

export const LogOptions = `
`

export const CaptchaOptions = `
    pack: Packages! # package name
    type: String! # captcha configuration type from config captcha.key
`

export const LimitOptions = `
    limitInterval: String! # 60s 20h 1d 1w 1m 1y
    limitTreshold: Int! #  number of requests per interval
`

export const ModelOptions = `
    mongoose: String # model name: @ts.app/core/models/config
`

export const AdminOptions = `
    title: String!
    app: String
    iframe: String
    icon: String
`

export const SearchInput = `
    limit: Int
    offset: Int
    text: String!
`

export const AccessInput = `
    status: AccessStatus!
    pack: Packages!
    resource: String
    action: String
    permissions: [PermissionType!]!
    created_by: ObjectId
    updated_by: ObjectId
`

export const LogOptionsDocument = `
    enabled: Boolean!
    max: Int!
`

export const LogOptionsInput = `
    enabled: Boolean
    max: Int
`

export default `#graphql
    scalar DateTime
    scalar Object
    scalar ObjectId
    scalar Packages

    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }

    input SearchInput {
        ${SearchInput}
    }
    
    interface SearchScore {
        ${SearchScore}
    }

    interface Pagination {
        ${Pagination}
    }

    interface MongoId {
        ${MongoId}
    }

    interface MongoIdMeybe {
        ${MongoIdMeybe}
    }

    interface EnabledMeybe {
        ${EnabledMeybe}
    }

    interface MongoTimeStamps {
        ${MongoTimeStamps}
    }

    interface MongoTimeStampsMeybe {
        ${MongoTimeStampsMeybe}
    }

    type MongoTimeStampsType implements MongoTimeStamps {
        ${MongoTimeStamps}
    }

    enum MongoOperationType {
        modify
        create
        createIndexes
        delete
        dropDatabase
        drop
        dropIndexes
        dropCollection
        insert
        invalidate
        refineCollectionShardKey
        rename
        replace
        reshardCollection
        shardCollection
        update
    }

    type MongoStreamNameSpace {
        db: String
        coll: String
    }

    type MongoStreamUpdateDescription {
        updatedFields: Object!
        removedFields: [String!]!
        truncatedArrays: [String!]!
    }

    type MongoStream {
        operationType: MongoOperationType!
        ns: MongoStreamNameSpace!
        documentKey: MongoId!
        fullDocument: Object
        fullDocumentBeforeChange: Object
        updateDescription: MongoStreamUpdateDescription
    }

    input MongoStreamInput {
        operations: [MongoOperationType!]!
    }

    type MongoUpdateRes {
        acknowledged: Boolean
        matchedCount: Int
        upsertedId: String
        upsertedCount: Int
        modifiedCount: Int
    }

    type MySqlRes {
        fieldCount: Int
        affectedRows: Int
        insertId: Int
        serverStatus: Int
        warningCount: Int
        message: String
        protocol41: Boolean
        changedRows: Int
    }

    interface LogOptionsInput {
        ${LogOptionsInput}
    }

    interface LogOptionsDocument {
        ${LogOptionsDocument}
    }

    interface Enabled {
        ${Enabled}
    }

    interface ServerAccess {
        ${ServerAccess}
    }

    type AuthOptions implements Enabled {
        ${Enabled}
        ${AuthOptions}
    }

    type LogOptions implements Enabled {
        ${Enabled}
        ${LogOptions}
    }

    type CaptchaOptions implements Enabled {
        ${Enabled}
        ${CaptchaOptions}
    }

    type LimitOptions implements Enabled {
        ${Enabled}
        ${LimitOptions}
    }

    type ModelOptions {
        ${Enabled}
        ${ModelOptions}
    }

    type DefaultAccessOptions {
        ${DefaultAccessOptions}
    }

    type AdminOptionsInput {
        ${EnabledMeybe}
        ${AdminOptions}
        hash: String
    }

    type AdminOptions {
        ${Enabled}
        ${AdminOptions}
        hash: String!
    }

    type AccessOptionsInput implements EnabledMeybe { 
        log: LogOptions
        auth: AuthOptions
        captcha: CaptchaOptions
        limit: LimitOptions
        model: ModelOptions
        admin: AdminOptionsInput
        info: [String]
        permission: PermissionType
        ${EnabledMeybe}
    }

    type AccessOptions implements Enabled { 
        log: LogOptions!
        auth: AuthOptions
        captcha: CaptchaOptions
        limit: LimitOptions
        model: ModelOptions
        admin: AdminOptions
        info: [String]
        permission: PermissionType
        ${Enabled}
        ${DefaultAccessOptions}
    }
    

    type PackageOptions {
        pack: Packages!
        alias: String!
        version: String!
        haproxy_rewrite: Boolean
        next_disable_alias: Boolean
    }

    interface AccessInput {
        ${AccessInput}
    }

    type AccessDocument implements AccessInput & MongoTimeStampsMeybe { # access to resource, used in user.access, key.access
        ${AccessInput}
        ${MongoTimeStampsMeybe}
    }
    
    enum ExpressMethod {
        all
        get
        post
        put
        delete
        patch
        options
        head
        use
    }

    enum GraphqlMethod {
        Query
        Mutation
        Subscription
    }
    
    enum ServerMethod {
        # express
        all
        get
        post
        put
        delete
        patch
        options
        head
        use
        
        # graphql
        Query
        Mutation
        Subscription
    }

    enum ServerType {
        EXPRESS
        GRAPHQL
    }

    enum AccessStatus {
        Enabled
        Disabled
    }

    enum TokenType {
        Basic
        ApiKey
        Bearer
        Cookie
    }

    enum PermissionType {
        Read
        Write
        Update
        Delete
    }
`