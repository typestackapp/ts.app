
            import type { DeepRequired } from 'utility-types'
            import type { Types as MongooseTypes } from 'mongoose'
            import type { IResolvers, IGraphqlMethod, IAccessOptions } from '@ts.app/core/codegen/admin/index.js'
            

            /* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
  Object: { input: {[key:string]: any}; output: {[key:string]: any}; }
  ObjectId: { input: MongooseTypes.ObjectId; output: MongooseTypes.ObjectId; }
  Packages: { input: string; output: string; }
};

export type AccessDocument = AccessInput & MongoTimeStampsMeybe & {
  __typename?: 'AccessDocument';
  action?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  created_by?: Maybe<Scalars['ObjectId']['output']>;
  pack: Scalars['Packages']['output'];
  permissions: Array<PermissionType>;
  resource?: Maybe<Scalars['String']['output']>;
  status: AccessStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updated_by?: Maybe<Scalars['ObjectId']['output']>;
};

export type AccessInput = {
  action?: Maybe<Scalars['String']['output']>;
  created_by?: Maybe<Scalars['ObjectId']['output']>;
  pack: Scalars['Packages']['output'];
  permissions: Array<PermissionType>;
  resource?: Maybe<Scalars['String']['output']>;
  status: AccessStatus;
  updated_by?: Maybe<Scalars['ObjectId']['output']>;
};

export type AccessOptions = Enabled & {
  __typename?: 'AccessOptions';
  action?: Maybe<Scalars['String']['output']>;
  admin?: Maybe<AdminOptions>;
  auth?: Maybe<AuthOptions>;
  captcha?: Maybe<CaptchaOptions>;
  enabled: Scalars['Boolean']['output'];
  info?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  limit?: Maybe<LimitOptions>;
  log: LogOptions;
  model?: Maybe<ModelOptions>;
  pack: Scalars['Packages']['output'];
  permission?: Maybe<PermissionType>;
  resource?: Maybe<Scalars['String']['output']>;
  resourceAction: Scalars['String']['output'];
};

export enum AccessStatus {
  Disabled = 'Disabled',
  Enabled = 'Enabled'
}

export type AdminOptions = {
  __typename?: 'AdminOptions';
  app?: Maybe<Scalars['String']['output']>;
  hash: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  iframe?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type AuthOptions = Enabled & {
  __typename?: 'AuthOptions';
  authParamKeyName?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  tokens: Array<TokenType>;
};

export type CaptchaOptions = Enabled & {
  __typename?: 'CaptchaOptions';
  enabled: Scalars['Boolean']['output'];
  pack: Scalars['Packages']['output'];
  type: Scalars['String']['output'];
};

export type ConfigBase = {
  __typename?: 'ConfigBase';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  title: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type ConfigDocument = {
  __typename?: 'ConfigDocument';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log: LogOptionsDocument;
  pack: Scalars['Packages']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type ConfigDocumentBase = {
  __typename?: 'ConfigDocumentBase';
  log: LogOptionsDocument;
  pack: Scalars['Packages']['output'];
  type: Scalars['String']['output'];
};

export type ConfigInput = {
  __typename?: 'ConfigInput';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log?: Maybe<LogOptionsInput>;
  title: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type ConfigOutput = MongoTimeStamps & {
  __typename?: 'ConfigOutput';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log: LogOptionsDocument;
  pack: Scalars['Packages']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type ConfigPagination = Pagination & {
  __typename?: 'ConfigPagination';
  list: Array<ConfigSearch>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type ConfigSearch = MongoTimeStamps & SearchScore & {
  __typename?: 'ConfigSearch';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log: LogOptionsDocument;
  pack: Scalars['Packages']['output'];
  score?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type CountryDocument = CountryInput & {
  __typename?: 'CountryDocument';
  alpha2: Scalars['String']['output'];
  alpha3: Scalars['String']['output'];
  area?: Maybe<Scalars['Int']['output']>;
  gdp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  population?: Maybe<Scalars['Int']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  timezones: Array<TimeZoneDocument>;
};

export type CountryInput = {
  alpha2: Scalars['String']['output'];
  alpha3: Scalars['String']['output'];
  area?: Maybe<Scalars['Int']['output']>;
  gdp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  population?: Maybe<Scalars['Int']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
};

export type CountryPagination = Pagination & {
  __typename?: 'CountryPagination';
  list: Array<CountrySearch>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type CountrySearch = SearchScore & {
  __typename?: 'CountrySearch';
  alpha2: Scalars['String']['output'];
  alpha3: Scalars['String']['output'];
  area?: Maybe<Scalars['Int']['output']>;
  gdp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  population?: Maybe<Scalars['Int']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  timezones: Array<TimeZoneDocument>;
};

export type CountryUpdate = {
  alpha2?: InputMaybe<Scalars['String']['input']>;
  alpha3?: InputMaybe<Scalars['String']['input']>;
  area?: InputMaybe<Scalars['Int']['input']>;
  gdp?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  population?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type DefaultAccessOptions = {
  __typename?: 'DefaultAccessOptions';
  action?: Maybe<Scalars['String']['output']>;
  pack: Scalars['Packages']['output'];
  resource?: Maybe<Scalars['String']['output']>;
  resourceAction: Scalars['String']['output'];
};

export type Enabled = {
  enabled: Scalars['Boolean']['output'];
};

export enum ExpressMethod {
  All = 'all',
  Delete = 'delete',
  Get = 'get',
  Head = 'head',
  Options = 'options',
  Patch = 'patch',
  Post = 'post',
  Put = 'put',
  Use = 'use'
}

export type GraphqlAccess = {
  __typename?: 'GraphqlAccess';
  pack: Scalars['Packages']['output'];
  services: Array<Scalars['String']['output']>;
};

export enum GraphqlMethod {
  Mutation = 'Mutation',
  Query = 'Query',
  Subscription = 'Subscription'
}

export type JobActionDocument = JobActionInput & MongoId & MongoTimeStamps & {
  __typename?: 'JobActionDocument';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  job_id?: Maybe<Scalars['ObjectId']['output']>;
  steps: Array<JobStepInput>;
  updatedAt: Scalars['DateTime']['output'];
};

export type JobActionInput = {
  job_id?: Maybe<Scalars['ObjectId']['output']>;
  steps: Array<JobStepInput>;
};

export type JobActionPagination = Pagination & {
  __typename?: 'JobActionPagination';
  list: Array<JobActionSearch>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type JobActionSearch = JobActionInput & MongoId & MongoTimeStamps & SearchScore & {
  __typename?: 'JobActionSearch';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  job_id?: Maybe<Scalars['ObjectId']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  steps: Array<JobStepInput>;
  updatedAt: Scalars['DateTime']['output'];
};

export type JobBase = {
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  status: JobStatus;
  updated_by: Scalars['ObjectId']['output'];
};

export type JobDocument = JobBase & MongoId & MongoTimeStamps & {
  __typename?: 'JobDocument';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  log: LogOptionsDocument;
  pack: Scalars['Packages']['output'];
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  run_on_startup: Scalars['Boolean']['output'];
  status: JobStatus;
  time_zone: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type JobInput = {
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  log?: Maybe<LogOptionsInput>;
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  run_on_startup?: Maybe<Scalars['Boolean']['output']>;
  status: JobStatus;
  time_zone?: Maybe<Scalars['String']['output']>;
  updated_by: Scalars['ObjectId']['output'];
};

export type JobPagination = Pagination & {
  __typename?: 'JobPagination';
  list: Array<JobSearch>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type JobSearch = JobBase & JobInput & MongoId & MongoTimeStamps & SearchScore & {
  __typename?: 'JobSearch';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  log?: Maybe<LogOptionsInput>;
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  run_on_startup?: Maybe<Scalars['Boolean']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  status: JobStatus;
  time_zone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export enum JobStatus {
  Active = 'Active',
  Disabled = 'Disabled',
  Error = 'Error',
  Initilized = 'Initilized',
  Success = 'Success'
}

export type JobStepInput = {
  data: Scalars['Object']['output'];
  error?: Maybe<Scalars['String']['output']>;
  identifier: Scalars['String']['output'];
  status: JobStepStatus;
};

export enum JobStepStatus {
  Error = 'Error',
  Executed = 'Executed',
  InQueue = 'InQueue',
  Initilized = 'Initilized'
}

export type LimitOptions = Enabled & {
  __typename?: 'LimitOptions';
  enabled: Scalars['Boolean']['output'];
  limitInterval: Scalars['String']['output'];
  limitTreshold: Scalars['Int']['output'];
};

export type LogOptions = Enabled & {
  __typename?: 'LogOptions';
  enabled: Scalars['Boolean']['output'];
};

export type LogOptionsDocument = {
  enabled: Scalars['Boolean']['output'];
  max: Scalars['Int']['output'];
};

export type LogOptionsInput = {
  enabled?: Maybe<Scalars['Boolean']['output']>;
  max?: Maybe<Scalars['Int']['output']>;
};

export type ModelOptions = {
  __typename?: 'ModelOptions';
  mongoose?: Maybe<Scalars['String']['output']>;
};

export type MongoId = {
  _id: Scalars['ObjectId']['output'];
};

export type MongoIdMeybe = {
  _id?: Maybe<Scalars['ObjectId']['output']>;
};

export enum MongoOperationType {
  Create = 'create',
  CreateIndexes = 'createIndexes',
  Delete = 'delete',
  Drop = 'drop',
  DropCollection = 'dropCollection',
  DropDatabase = 'dropDatabase',
  DropIndexes = 'dropIndexes',
  Insert = 'insert',
  Invalidate = 'invalidate',
  Modify = 'modify',
  RefineCollectionShardKey = 'refineCollectionShardKey',
  Rename = 'rename',
  Replace = 'replace',
  ReshardCollection = 'reshardCollection',
  ShardCollection = 'shardCollection',
  Update = 'update'
}

export type MongoStream = {
  __typename?: 'MongoStream';
  documentKey: MongoId;
  fullDocument?: Maybe<Scalars['Object']['output']>;
  fullDocumentBeforeChange?: Maybe<Scalars['Object']['output']>;
  ns: MongoStreamNameSpace;
  operationType: MongoOperationType;
  updateDescription?: Maybe<MongoStreamUpdateDescription>;
};

export type MongoStreamInput = {
  operations: Array<MongoOperationType>;
};

export type MongoStreamNameSpace = {
  __typename?: 'MongoStreamNameSpace';
  coll?: Maybe<Scalars['String']['output']>;
  db?: Maybe<Scalars['String']['output']>;
};

export type MongoStreamUpdateDescription = {
  __typename?: 'MongoStreamUpdateDescription';
  removedFields: Array<Scalars['String']['output']>;
  truncatedArrays: Array<Scalars['String']['output']>;
  updatedFields: Scalars['Object']['output'];
};

export type MongoTimeStamps = {
  createdAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MongoTimeStampsMeybe = {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MongoTimeStampsType = MongoTimeStamps & {
  __typename?: 'MongoTimeStampsType';
  createdAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MongoUpdateRes = {
  __typename?: 'MongoUpdateRes';
  acknowledged?: Maybe<Scalars['Boolean']['output']>;
  matchedCount?: Maybe<Scalars['Int']['output']>;
  modifiedCount?: Maybe<Scalars['Int']['output']>;
  upsertedCount?: Maybe<Scalars['Int']['output']>;
  upsertedId?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['Boolean']['output']>;
};

export type MySqlRes = {
  __typename?: 'MySqlRes';
  affectedRows?: Maybe<Scalars['Int']['output']>;
  changedRows?: Maybe<Scalars['Int']['output']>;
  fieldCount?: Maybe<Scalars['Int']['output']>;
  insertId?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  protocol41?: Maybe<Scalars['Boolean']['output']>;
  serverStatus?: Maybe<Scalars['Int']['output']>;
  warningCount?: Maybe<Scalars['Int']['output']>;
};

export type PackageOptions = {
  __typename?: 'PackageOptions';
  alias: Scalars['String']['output'];
  haproxy_rewrite?: Maybe<Scalars['Boolean']['output']>;
  next_disable_alias?: Maybe<Scalars['Boolean']['output']>;
  pack: Scalars['Packages']['output'];
  version: Scalars['String']['output'];
};

export type Pagination = {
  total?: Maybe<Scalars['Int']['output']>;
};

export enum PermissionType {
  Delete = 'Delete',
  Read = 'Read',
  Update = 'Update',
  Write = 'Write'
}

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['Boolean']['output']>;
  getAllAccessConfigs: Array<AccessOptions>;
  getAllPackageConfigs: Array<PackageOptions>;
  getAllRoles?: Maybe<Array<RoleConfigDocument>>;
  getConfig?: Maybe<ConfigOutput>;
  getCountry?: Maybe<CountryDocument>;
  getCurrentUser?: Maybe<UserOutput>;
  getJob?: Maybe<JobDocument>;
  getUser?: Maybe<UserOutput>;
  searchConfigs?: Maybe<ConfigPagination>;
  searchCountry: Array<CountrySearch>;
  searchJob?: Maybe<JobPagination>;
  searchTimezone: Array<TimeZoneSearch>;
};


export type QueryGetConfigArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetCountryArgs = {
  alpha2: Scalars['String']['input'];
};


export type QueryGetJobArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchConfigsArgs = {
  search: SearchInput;
};


export type QuerySearchCountryArgs = {
  list?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<SearchInput>;
};


export type QuerySearchJobArgs = {
  search?: InputMaybe<SearchInput>;
};


export type QuerySearchTimezoneArgs = {
  search?: InputMaybe<SearchInput>;
};

export type RoleConfigDataDocument = {
  __typename?: 'RoleConfigDataDocument';
  graphql_access: Array<GraphqlAccess>;
  name: Scalars['String']['output'];
  resource_access: Array<AccessDocument>;
};

export type RoleConfigDataInput = {
  __typename?: 'RoleConfigDataInput';
  graphql_access: Array<GraphqlAccess>;
  name: Scalars['String']['output'];
  resource_access: Array<AccessInput>;
};

export type RoleConfigDocument = MongoTimeStamps & {
  __typename?: 'RoleConfigDocument';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  data: RoleConfigDataDocument;
  log: LogOptionsDocument;
  pack: Scalars['Packages']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type RoleConfigInput = {
  __typename?: 'RoleConfigInput';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data: RoleConfigDataInput;
  log?: Maybe<LogOptionsInput>;
  title: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
};

export type SearchInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type SearchScore = {
  score?: Maybe<Scalars['Float']['output']>;
};

export type ServerAccess = {
  path: Array<Scalars['String']['output']>;
  serverMethod: ServerMethod;
  serverType: ServerType;
};

export enum ServerMethod {
  Mutation = 'Mutation',
  Query = 'Query',
  Subscription = 'Subscription',
  All = 'all',
  Delete = 'delete',
  Get = 'get',
  Head = 'head',
  Options = 'options',
  Patch = 'patch',
  Post = 'post',
  Put = 'put',
  Use = 'use'
}

export enum ServerType {
  Express = 'EXPRESS',
  Graphql = 'GRAPHQL'
}

export type Subscription = {
  __typename?: 'Subscription';
  _?: Maybe<Scalars['Boolean']['output']>;
  streamConfig?: Maybe<MongoStream>;
  streamJob?: Maybe<MongoStream>;
  streamJobAction?: Maybe<MongoStream>;
};


export type SubscriptionStreamConfigArgs = {
  stream: MongoStreamInput;
};


export type SubscriptionStreamJobArgs = {
  stream: MongoStreamInput;
};


export type SubscriptionStreamJobActionArgs = {
  stream: MongoStreamInput;
};

export type TimeZoneDocument = TimeZoneInput & {
  __typename?: 'TimeZoneDocument';
  alpha2?: Maybe<Scalars['String']['output']>;
  dst: Scalars['String']['output'];
  name: Scalars['String']['output'];
  std: Scalars['String']['output'];
};

export type TimeZoneInput = {
  alpha2?: Maybe<Scalars['String']['output']>;
  dst: Scalars['String']['output'];
  name: Scalars['String']['output'];
  std: Scalars['String']['output'];
};

export type TimeZonePagination = Pagination & {
  __typename?: 'TimeZonePagination';
  list: Array<TimeZoneSearch>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type TimeZoneSearch = SearchScore & {
  __typename?: 'TimeZoneSearch';
  alpha2?: Maybe<Scalars['String']['output']>;
  dst: Scalars['String']['output'];
  name: Scalars['String']['output'];
  score?: Maybe<Scalars['Float']['output']>;
  std: Scalars['String']['output'];
};

export enum TokenType {
  ApiKey = 'ApiKey',
  Basic = 'Basic',
  Bearer = 'Bearer',
  Cookie = 'Cookie'
}

export type UserDocument = MongoId & MongoTimeStamps & {
  __typename?: 'UserDocument';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  psw: Scalars['String']['output'];
  roles: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  usn: Scalars['String']['output'];
};

export type UserInput = {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  psw: Scalars['String']['output'];
  roles: Array<Scalars['String']['output']>;
  usn: Scalars['String']['output'];
};

export type UserOutput = MongoId & MongoTimeStamps & {
  __typename?: 'UserOutput';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  roles?: Maybe<Array<RoleConfigDocument>>;
  updatedAt: Scalars['DateTime']['output'];
  usn: Scalars['String']['output'];
};

export type GetRoleManagerDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoleManagerDataQuery = { __typename?: 'Query', getAllPackageConfigs: Array<{ __typename?: 'PackageOptions', pack: string, alias: string, version: string }>, getAllAccessConfigs: Array<{ __typename?: 'AccessOptions', enabled: boolean, resource?: string | null, pack: string, action?: string | null, resourceAction: string, info?: Array<string | null> | null, permission?: PermissionType | null, limit?: { __typename?: 'LimitOptions', enabled: boolean } | null, log: { __typename?: 'LogOptions', enabled: boolean }, auth?: { __typename?: 'AuthOptions', enabled: boolean, tokens: Array<TokenType> } | null, captcha?: { __typename?: 'CaptchaOptions', enabled: boolean } | null, model?: { __typename?: 'ModelOptions', mongoose?: string | null } | null, admin?: { __typename?: 'AdminOptions', app?: string | null, iframe?: string | null, title: string } | null }>, getAllRoles?: Array<{ __typename?: 'RoleConfigDocument', _id?: MongooseTypes.ObjectId | null, title: string, created_by: MongooseTypes.ObjectId, updated_by: MongooseTypes.ObjectId, pack: string, type: string, createdAt: Date, updatedAt: Date, data: { __typename?: 'RoleConfigDataDocument', name: string, resource_access: Array<{ __typename?: 'AccessDocument', status: AccessStatus, pack: string, resource?: string | null, action?: string | null, permissions: Array<PermissionType>, created_by?: MongooseTypes.ObjectId | null, updated_by?: MongooseTypes.ObjectId | null, createdAt?: Date | null, updatedAt?: Date | null }>, graphql_access: Array<{ __typename?: 'GraphqlAccess', pack: string, services: Array<string> }> } }> | null };

export type GetAdminDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminDataQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'UserOutput', _id: MongooseTypes.ObjectId, usn: string, roles?: Array<{ __typename?: 'RoleConfigDocument', _id?: MongooseTypes.ObjectId | null, title: string, pack: string, type: string, data: { __typename?: 'RoleConfigDataDocument', name: string, resource_access: Array<{ __typename?: 'AccessDocument', status: AccessStatus, pack: string, resource?: string | null, action?: string | null, permissions: Array<PermissionType> }>, graphql_access: Array<{ __typename?: 'GraphqlAccess', pack: string, services: Array<string> }> } }> | null } | null };


export const GetRoleManagerDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRoleManagerData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPackageConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAllAccessConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceAction"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"permission"}},{"kind":"Field","name":{"kind":"Name","value":"limit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"log"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"}}]}},{"kind":"Field","name":{"kind":"Name","value":"captcha"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"model"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mongoose"}}]}},{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"}},{"kind":"Field","name":{"kind":"Name","value":"iframe"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAllRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"updated_by"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"resource_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"updated_by"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graphql_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"services"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetRoleManagerDataQuery, GetRoleManagerDataQueryVariables>;
export const GetAdminDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAdminData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"usn"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"resource_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graphql_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"services"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAdminDataQuery, GetAdminDataQueryVariables>;

            // additional types generated by build-graphql.js script!
            export type GraphqlResolvers = Record<IGraphqlMethod, Record<string, any>>

            export type GraphObj = Scalars["Object"]["input"]

            type GraphqlResources<T extends GraphqlResolvers> = {
                [K in IGraphqlMethod]?: {
                    [K2 in keyof T[K]]?: IAccessOptions  
                } 
            }

            export type Resources<T> = GraphqlResources<DeepRequired<IResolvers<T>>>
        