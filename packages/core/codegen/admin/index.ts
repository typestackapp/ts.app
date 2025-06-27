
            import type { DeepRequired } from 'utility-types'
            import type { Types as MongooseTypes } from 'mongoose'
            
            

            import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
  Object: { input: {[key:string]: any}; output: {[key:string]: any}; }
  ObjectId: { input: MongooseTypes.ObjectId; output: MongooseTypes.ObjectId; }
  Packages: { input: string; output: string; }
}

export interface IAccessDocument extends IAccessInput, IMongoTimeStampsMeybe {
  action?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  created_by?: Maybe<Scalars['ObjectId']['output']>;
  pack: Scalars['Packages']['output'];
  permissions: Array<IPermissionType>;
  resource?: Maybe<Scalars['String']['output']>;
  status: IAccessStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updated_by?: Maybe<Scalars['ObjectId']['output']>;
}

export interface IAccessInput {
  action?: Maybe<Scalars['String']['output']>;
  created_by?: Maybe<Scalars['ObjectId']['output']>;
  pack: Scalars['Packages']['output'];
  permissions: Array<IPermissionType>;
  resource?: Maybe<Scalars['String']['output']>;
  status: IAccessStatus;
  updated_by?: Maybe<Scalars['ObjectId']['output']>;
}

export interface IAccessOptions extends IEnabled {
  action?: Maybe<Scalars['String']['output']>;
  admin?: Maybe<IAdminOptions>;
  auth?: Maybe<IAuthOptions>;
  captcha?: Maybe<ICaptchaOptions>;
  enabled: Scalars['Boolean']['output'];
  info?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  limit?: Maybe<ILimitOptions>;
  log: ILogOptions;
  model?: Maybe<IModelOptions>;
  pack: Scalars['Packages']['output'];
  permission?: Maybe<IPermissionType>;
  resource?: Maybe<Scalars['String']['output']>;
  resourceAction: Scalars['String']['output'];
}

export interface IAccessOptionsInput extends IEnabledMeybe {
  admin?: Maybe<IAdminOptionsInput>;
  auth?: Maybe<IAuthOptionsInput>;
  captcha?: Maybe<ICaptchaOptionsInput>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  info?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  limit?: Maybe<ILimitOptionsInput>;
  log?: Maybe<ILogOptionsInput>;
  model?: Maybe<IModelOptionsInput>;
  permission?: Maybe<IPermissionType>;
}

export type IAccessStatus =
  | 'Disabled'
  | 'Enabled';

export interface IAdminOptions {
  app?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  hash: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  iframe?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
}

export interface IAdminOptionsInput {
  app?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  iframe?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
}

export interface IAuthOptions extends IEnabled {
  authParamKeyName?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  tokens: Array<ITokenType>;
}

export interface IAuthOptionsInput extends IEnabledMeybe {
  authParamKeyName?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  tokens: Array<ITokenType>;
}

export interface ICaptchaOptions extends IEnabled {
  enabled: Scalars['Boolean']['output'];
  pack: Scalars['Packages']['output'];
  type: Scalars['String']['output'];
}

export interface ICaptchaOptionsInput extends IEnabledMeybe {
  enabled?: Maybe<Scalars['Boolean']['output']>;
  pack: Scalars['Packages']['output'];
  type: Scalars['String']['output'];
}

export interface IConfigBase {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  title: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface IConfigDocument {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log: ILogOptions;
  pack: Scalars['Packages']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface IConfigDocumentBase {
  log: ILogOptions;
  pack: Scalars['Packages']['output'];
  type: Scalars['String']['output'];
}

export interface IConfigInput {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log?: Maybe<ILogOptionsInput>;
  title: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface IConfigOutput extends IMongoTimeStamps {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log: ILogOptions;
  pack: Scalars['Packages']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface IConfigPagination extends IPagination {
  list: Array<IConfigSearch>;
  total?: Maybe<Scalars['Int']['output']>;
}

export interface IConfigSearch extends IMongoTimeStamps, ISearchScore {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  data?: Maybe<Scalars['Object']['output']>;
  log: ILogOptions;
  pack: Scalars['Packages']['output'];
  score?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface ICountryDocument extends ICountryInput {
  alpha2: Scalars['String']['output'];
  alpha3: Scalars['String']['output'];
  area?: Maybe<Scalars['Int']['output']>;
  gdp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  population?: Maybe<Scalars['Int']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  timezones: Array<ITimeZoneDocument>;
}

export interface ICountryInput {
  alpha2: Scalars['String']['output'];
  alpha3: Scalars['String']['output'];
  area?: Maybe<Scalars['Int']['output']>;
  gdp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  population?: Maybe<Scalars['Int']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
}

export interface ICountryPagination extends IPagination {
  list: Array<ICountrySearch>;
  total?: Maybe<Scalars['Int']['output']>;
}

export interface ICountrySearch extends ISearchScore {
  alpha2: Scalars['String']['output'];
  alpha3: Scalars['String']['output'];
  area?: Maybe<Scalars['Int']['output']>;
  gdp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  population?: Maybe<Scalars['Int']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  timezones: Array<ITimeZoneDocument>;
}

export interface ICountryUpdate {
  alpha2?: InputMaybe<Scalars['String']['input']>;
  alpha3?: InputMaybe<Scalars['String']['input']>;
  area?: InputMaybe<Scalars['Int']['input']>;
  gdp?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  population?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
}

export interface IDefaultAccessOptions {
  action?: Maybe<Scalars['String']['output']>;
  pack: Scalars['Packages']['output'];
  resource?: Maybe<Scalars['String']['output']>;
  resourceAction: Scalars['String']['output'];
}

export interface IEnabled {
  enabled: Scalars['Boolean']['output'];
}

export interface IEnabledMeybe {
  enabled?: Maybe<Scalars['Boolean']['output']>;
}

export type IExpressMethod =
  | 'all'
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put'
  | 'use';

export interface IGraphqlAccess {
  pack: Scalars['Packages']['output'];
  services: Array<Scalars['String']['output']>;
}

export type IGraphqlMethod =
  | 'Mutation'
  | 'Query'
  | 'Subscription';

export interface IJobActionDocument extends IJobActionInput, IMongoId, IMongoTimeStamps {
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  job_id?: Maybe<Scalars['ObjectId']['output']>;
  steps: Array<IJobStepInput>;
  updatedAt: Scalars['DateTime']['output'];
}

export interface IJobActionInput {
  job_id?: Maybe<Scalars['ObjectId']['output']>;
  steps: Array<IJobStepInput>;
}

export interface IJobActionPagination extends IPagination {
  list: Array<IJobActionSearch>;
  total?: Maybe<Scalars['Int']['output']>;
}

export interface IJobActionSearch extends IJobActionInput, IMongoId, IMongoTimeStamps, ISearchScore {
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  job_id?: Maybe<Scalars['ObjectId']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  steps: Array<IJobStepInput>;
  updatedAt: Scalars['DateTime']['output'];
}

export interface IJobBase {
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  status: IJobStatus;
  updated_by: Scalars['ObjectId']['output'];
}

export interface IJobDocument extends IJobBase, IMongoId, IMongoTimeStamps {
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  log: ILogOptions;
  pack: Scalars['Packages']['output'];
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  run_on_startup: Scalars['Boolean']['output'];
  status: IJobStatus;
  time_zone: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface IJobInput {
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  log?: Maybe<ILogOptionsInput>;
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  run_on_startup?: Maybe<Scalars['Boolean']['output']>;
  status: IJobStatus;
  time_zone?: Maybe<Scalars['String']['output']>;
  updated_by: Scalars['ObjectId']['output'];
}

export interface IJobPagination extends IPagination {
  list: Array<IJobSearch>;
  total?: Maybe<Scalars['Int']['output']>;
}

export interface IJobSearch extends IJobBase, IJobInput, IMongoId, IMongoTimeStamps, ISearchScore {
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  cron?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Object']['output']>;
  description: Scalars['String']['output'];
  log?: Maybe<ILogOptionsInput>;
  params: Scalars['Object']['output'];
  parent_id?: Maybe<Scalars['ObjectId']['output']>;
  run_on_startup?: Maybe<Scalars['Boolean']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  status: IJobStatus;
  time_zone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export type IJobStatus =
  | 'Active'
  | 'Disabled'
  | 'Error'
  | 'Initilized'
  | 'Success';

export interface IJobStepInput {
  data: Scalars['Object']['output'];
  error?: Maybe<Scalars['String']['output']>;
  identifier: Scalars['String']['output'];
  status: IJobStepStatus;
}

export type IJobStepStatus =
  | 'Error'
  | 'Executed'
  | 'InQueue'
  | 'Initilized';

export interface ILimitOptions extends IEnabled {
  enabled: Scalars['Boolean']['output'];
  limitInterval: Scalars['String']['output'];
  limitTreshold: Scalars['Int']['output'];
}

export interface ILimitOptionsInput extends IEnabledMeybe {
  enabled?: Maybe<Scalars['Boolean']['output']>;
  limitInterval: Scalars['String']['output'];
  limitTreshold: Scalars['Int']['output'];
}

export interface ILogOptions extends IEnabled {
  enabled: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['Int']['output']>;
}

export interface ILogOptionsInput extends IEnabledMeybe {
  enabled?: Maybe<Scalars['Boolean']['output']>;
  max?: Maybe<Scalars['Int']['output']>;
}

export interface IModelOptions extends IEnabled {
  enabled: Scalars['Boolean']['output'];
  mongoose?: Maybe<Scalars['String']['output']>;
}

export interface IModelOptionsInput extends IEnabledMeybe {
  enabled?: Maybe<Scalars['Boolean']['output']>;
  mongoose?: Maybe<Scalars['String']['output']>;
}

export interface IMongoId {
  _id: Scalars['ObjectId']['output'];
}

export interface IMongoIdMeybe {
  _id?: Maybe<Scalars['ObjectId']['output']>;
}

export type IMongoOperationType =
  | 'create'
  | 'createIndexes'
  | 'delete'
  | 'drop'
  | 'dropCollection'
  | 'dropDatabase'
  | 'dropIndexes'
  | 'insert'
  | 'invalidate'
  | 'modify'
  | 'refineCollectionShardKey'
  | 'rename'
  | 'replace'
  | 'reshardCollection'
  | 'shardCollection'
  | 'update';

export interface IMongoStream {
  documentKey: IMongoId;
  fullDocument?: Maybe<Scalars['Object']['output']>;
  fullDocumentBeforeChange?: Maybe<Scalars['Object']['output']>;
  ns: IMongoStreamNameSpace;
  operationType: IMongoOperationType;
  updateDescription?: Maybe<IMongoStreamUpdateDescription>;
}

export interface IMongoStreamInput {
  operations: Array<IMongoOperationType>;
}

export interface IMongoStreamNameSpace {
  coll?: Maybe<Scalars['String']['output']>;
  db?: Maybe<Scalars['String']['output']>;
}

export interface IMongoStreamUpdateDescription {
  removedFields: Array<Scalars['String']['output']>;
  truncatedArrays: Array<Scalars['String']['output']>;
  updatedFields: Scalars['Object']['output'];
}

export interface IMongoTimeStamps {
  createdAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
}

export interface IMongoTimeStampsMeybe {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
}

export interface IMongoTimeStampsType extends IMongoTimeStamps {
  createdAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
}

export interface IMongoUpdateRes {
  acknowledged?: Maybe<Scalars['Boolean']['output']>;
  matchedCount?: Maybe<Scalars['Int']['output']>;
  modifiedCount?: Maybe<Scalars['Int']['output']>;
  upsertedCount?: Maybe<Scalars['Int']['output']>;
  upsertedId?: Maybe<Scalars['String']['output']>;
}

export interface IMutation {
  _?: Maybe<Scalars['Boolean']['output']>;
}

export interface IMySqlRes {
  affectedRows?: Maybe<Scalars['Int']['output']>;
  changedRows?: Maybe<Scalars['Int']['output']>;
  fieldCount?: Maybe<Scalars['Int']['output']>;
  insertId?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  protocol41?: Maybe<Scalars['Boolean']['output']>;
  serverStatus?: Maybe<Scalars['Int']['output']>;
  warningCount?: Maybe<Scalars['Int']['output']>;
}

export interface IPackageOptions {
  alias: Scalars['String']['output'];
  haproxy_rewrite?: Maybe<Scalars['Boolean']['output']>;
  next_disable_alias?: Maybe<Scalars['Boolean']['output']>;
  pack: Scalars['Packages']['output'];
  version: Scalars['String']['output'];
}

export interface IPagination {
  total?: Maybe<Scalars['Int']['output']>;
}

export type IPermissionType =
  | 'Delete'
  | 'Read'
  | 'Update'
  | 'Write';

export interface IQuery {
  _?: Maybe<Scalars['Boolean']['output']>;
  getAllAccessConfigs: Array<IAccessOptions>;
  getAllPackageConfigs: Array<IPackageOptions>;
  getAllRoles?: Maybe<Array<IRoleConfigDocument>>;
  getConfig?: Maybe<IConfigOutput>;
  getCountry?: Maybe<ICountryDocument>;
  getCurrentUser?: Maybe<IUserOutput>;
  getJob?: Maybe<IJobDocument>;
  getUser?: Maybe<IUserOutput>;
  searchConfigs?: Maybe<IConfigPagination>;
  searchCountry: Array<ICountrySearch>;
  searchJob?: Maybe<IJobPagination>;
  searchTimezone: Array<ITimeZoneSearch>;
}


export interface IQueryGetConfigArgs {
  id: Scalars['String']['input'];
}


export interface IQueryGetCountryArgs {
  alpha2: Scalars['String']['input'];
}


export interface IQueryGetJobArgs {
  id: Scalars['String']['input'];
}


export interface IQueryGetUserArgs {
  id: Scalars['String']['input'];
}


export interface IQuerySearchConfigsArgs {
  search: ISearchInput;
}


export interface IQuerySearchCountryArgs {
  list?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<ISearchInput>;
}


export interface IQuerySearchJobArgs {
  search?: InputMaybe<ISearchInput>;
}


export interface IQuerySearchTimezoneArgs {
  search?: InputMaybe<ISearchInput>;
}

export interface IRoleConfigDataDocument {
  graphql_access: Array<IGraphqlAccess>;
  name: Scalars['String']['output'];
  resource_access: Array<IAccessDocument>;
}

export interface IRoleConfigDataInput {
  graphql_access: Array<IGraphqlAccess>;
  name: Scalars['String']['output'];
  resource_access: Array<IAccessInput>;
}

export interface IRoleConfigDocument extends IMongoTimeStamps {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ObjectId']['output'];
  data: IRoleConfigDataDocument;
  log: ILogOptions;
  pack: Scalars['Packages']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface IRoleConfigInput {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_by: Scalars['ObjectId']['output'];
  data: IRoleConfigDataInput;
  log?: Maybe<ILogOptionsInput>;
  title: Scalars['String']['output'];
  updated_by: Scalars['ObjectId']['output'];
}

export interface ISearchInput {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
}

export interface ISearchScore {
  score?: Maybe<Scalars['Float']['output']>;
}

export interface IServerAccess {
  path: Array<Scalars['String']['output']>;
  serverMethod: IServerMethod;
  serverType: IServerType;
}

export type IServerMethod =
  | 'Mutation'
  | 'Query'
  | 'Subscription'
  | 'all'
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put'
  | 'use';

export type IServerType =
  | 'EXPRESS'
  | 'GRAPHQL';

export interface ISubscription {
  _?: Maybe<Scalars['Boolean']['output']>;
  streamConfig?: Maybe<IMongoStream>;
  streamJob?: Maybe<IMongoStream>;
  streamJobAction?: Maybe<IMongoStream>;
}


export interface ISubscriptionStreamConfigArgs {
  stream: IMongoStreamInput;
}


export interface ISubscriptionStreamJobArgs {
  stream: IMongoStreamInput;
}


export interface ISubscriptionStreamJobActionArgs {
  stream: IMongoStreamInput;
}

export interface ITimeZoneDocument extends ITimeZoneInput {
  alpha2?: Maybe<Scalars['String']['output']>;
  dst: Scalars['String']['output'];
  name: Scalars['String']['output'];
  std: Scalars['String']['output'];
}

export interface ITimeZoneInput {
  alpha2?: Maybe<Scalars['String']['output']>;
  dst: Scalars['String']['output'];
  name: Scalars['String']['output'];
  std: Scalars['String']['output'];
}

export interface ITimeZonePagination extends IPagination {
  list: Array<ITimeZoneSearch>;
  total?: Maybe<Scalars['Int']['output']>;
}

export interface ITimeZoneSearch extends ISearchScore {
  alpha2?: Maybe<Scalars['String']['output']>;
  dst: Scalars['String']['output'];
  name: Scalars['String']['output'];
  score?: Maybe<Scalars['Float']['output']>;
  std: Scalars['String']['output'];
}

export type ITokenType =
  | 'ApiKey'
  | 'Basic'
  | 'Bearer'
  | 'Cookie';

export interface IUserDocument extends IMongoId, IMongoTimeStamps {
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  psw: Scalars['String']['output'];
  roles: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  usn: Scalars['String']['output'];
}

export interface IUserInput {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  psw: Scalars['String']['output'];
  roles: Array<Scalars['String']['output']>;
  usn: Scalars['String']['output'];
}

export interface IUserOutput extends IMongoId, IMongoTimeStamps {
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  roles?: Maybe<Array<IRoleConfigDocument>>;
  updatedAt: Scalars['DateTime']['output'];
  usn: Scalars['String']['output'];
}

export type IGetRoleManagerDataQueryVariables = Exact<{ [key: string]: never; }>;


export type IGetRoleManagerDataQuery = { getAllPackageConfigs: Array<{ pack: string, alias: string, version: string }>, getAllAccessConfigs: Array<{ enabled: boolean, resource?: string | null, pack: string, action?: string | null, resourceAction: string, info?: Array<string | null> | null, permission?: IPermissionType | null, limit?: { enabled: boolean } | null, log: { enabled: boolean }, auth?: { enabled: boolean, tokens: Array<ITokenType> } | null, captcha?: { enabled: boolean } | null, model?: { mongoose?: string | null } | null, admin?: { app?: string | null, iframe?: string | null, title: string } | null }>, getAllRoles?: Array<{ _id?: MongooseTypes.ObjectId | null, title: string, created_by: MongooseTypes.ObjectId, updated_by: MongooseTypes.ObjectId, pack: string, type: string, createdAt: Date, updatedAt: Date, data: { name: string, resource_access: Array<{ status: IAccessStatus, pack: string, resource?: string | null, action?: string | null, permissions: Array<IPermissionType>, created_by?: MongooseTypes.ObjectId | null, updated_by?: MongooseTypes.ObjectId | null, createdAt?: Date | null, updatedAt?: Date | null }>, graphql_access: Array<{ pack: string, services: Array<string> }> } }> | null };

export type IGetAdminDataQueryVariables = Exact<{ [key: string]: never; }>;


export type IGetAdminDataQuery = { getCurrentUser?: { _id: MongooseTypes.ObjectId, usn: string, roles?: Array<{ _id?: MongooseTypes.ObjectId | null, title: string, pack: string, type: string, data: { name: string, resource_access: Array<{ status: IAccessStatus, pack: string, resource?: string | null, action?: string | null, permissions: Array<IPermissionType> }>, graphql_access: Array<{ pack: string, services: Array<string> }> } }> | null } | null };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type IResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  AccessInput: ( IAccessDocument );
  CountryInput: ( ICountryDocument );
  Enabled: ( IAccessOptions ) | ( IAuthOptions ) | ( ICaptchaOptions ) | ( ILimitOptions ) | ( ILogOptions ) | ( IModelOptions );
  EnabledMeybe: ( IAccessOptionsInput ) | ( IAuthOptionsInput ) | ( ICaptchaOptionsInput ) | ( ILimitOptionsInput ) | ( ILogOptionsInput ) | ( IModelOptionsInput );
  JobActionInput: ( Omit<IJobActionDocument, 'steps'> & { steps: Array<_RefType['JobStepInput']> } ) | ( Omit<IJobActionSearch, 'steps'> & { steps: Array<_RefType['JobStepInput']> } );
  JobBase: ( IJobDocument ) | ( IJobSearch );
  JobInput: ( IJobSearch );
  JobStepInput: never;
  MongoId: ( Omit<IJobActionDocument, 'steps'> & { steps: Array<_RefType['JobStepInput']> } ) | ( Omit<IJobActionSearch, 'steps'> & { steps: Array<_RefType['JobStepInput']> } ) | ( IJobDocument ) | ( IJobSearch ) | ( IUserDocument ) | ( IUserOutput );
  MongoIdMeybe: never;
  MongoTimeStamps: ( IConfigOutput ) | ( IConfigSearch ) | ( Omit<IJobActionDocument, 'steps'> & { steps: Array<_RefType['JobStepInput']> } ) | ( Omit<IJobActionSearch, 'steps'> & { steps: Array<_RefType['JobStepInput']> } ) | ( IJobDocument ) | ( IJobSearch ) | ( IMongoTimeStampsType ) | ( IRoleConfigDocument ) | ( IUserDocument ) | ( IUserOutput );
  MongoTimeStampsMeybe: ( IAccessDocument );
  Pagination: ( IConfigPagination ) | ( ICountryPagination ) | ( Omit<IJobActionPagination, 'list'> & { list: Array<_RefType['JobActionSearch']> } ) | ( IJobPagination ) | ( ITimeZonePagination );
  SearchScore: ( IConfigSearch ) | ( ICountrySearch ) | ( Omit<IJobActionSearch, 'steps'> & { steps: Array<_RefType['JobStepInput']> } ) | ( IJobSearch ) | ( ITimeZoneSearch );
  ServerAccess: never;
  TimeZoneInput: ( ITimeZoneDocument );
  UserInput: never;
};

/** Mapping between all available schema types and the resolvers types */
export type IResolversTypes = {
  AccessDocument: ResolverTypeWrapper<IAccessDocument>;
  AccessInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['AccessInput']>;
  AccessOptions: ResolverTypeWrapper<IAccessOptions>;
  AccessOptionsInput: ResolverTypeWrapper<IAccessOptionsInput>;
  AccessStatus: IAccessStatus;
  AdminOptions: ResolverTypeWrapper<IAdminOptions>;
  AdminOptionsInput: ResolverTypeWrapper<IAdminOptionsInput>;
  AuthOptions: ResolverTypeWrapper<IAuthOptions>;
  AuthOptionsInput: ResolverTypeWrapper<IAuthOptionsInput>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CaptchaOptions: ResolverTypeWrapper<ICaptchaOptions>;
  CaptchaOptionsInput: ResolverTypeWrapper<ICaptchaOptionsInput>;
  ConfigBase: ResolverTypeWrapper<IConfigBase>;
  ConfigDocument: ResolverTypeWrapper<IConfigDocument>;
  ConfigDocumentBase: ResolverTypeWrapper<IConfigDocumentBase>;
  ConfigInput: ResolverTypeWrapper<IConfigInput>;
  ConfigOutput: ResolverTypeWrapper<IConfigOutput>;
  ConfigPagination: ResolverTypeWrapper<IConfigPagination>;
  ConfigSearch: ResolverTypeWrapper<IConfigSearch>;
  CountryDocument: ResolverTypeWrapper<ICountryDocument>;
  CountryInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['CountryInput']>;
  CountryPagination: ResolverTypeWrapper<ICountryPagination>;
  CountrySearch: ResolverTypeWrapper<ICountrySearch>;
  CountryUpdate: ICountryUpdate;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DefaultAccessOptions: ResolverTypeWrapper<IDefaultAccessOptions>;
  Enabled: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['Enabled']>;
  EnabledMeybe: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['EnabledMeybe']>;
  ExpressMethod: IExpressMethod;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GraphqlAccess: ResolverTypeWrapper<IGraphqlAccess>;
  GraphqlMethod: IGraphqlMethod;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JobActionDocument: ResolverTypeWrapper<Omit<IJobActionDocument, 'steps'> & { steps: Array<IResolversTypes['JobStepInput']> }>;
  JobActionInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['JobActionInput']>;
  JobActionPagination: ResolverTypeWrapper<Omit<IJobActionPagination, 'list'> & { list: Array<IResolversTypes['JobActionSearch']> }>;
  JobActionSearch: ResolverTypeWrapper<Omit<IJobActionSearch, 'steps'> & { steps: Array<IResolversTypes['JobStepInput']> }>;
  JobBase: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['JobBase']>;
  JobDocument: ResolverTypeWrapper<IJobDocument>;
  JobInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['JobInput']>;
  JobPagination: ResolverTypeWrapper<IJobPagination>;
  JobSearch: ResolverTypeWrapper<IJobSearch>;
  JobStatus: IJobStatus;
  JobStepInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['JobStepInput']>;
  JobStepStatus: IJobStepStatus;
  LimitOptions: ResolverTypeWrapper<ILimitOptions>;
  LimitOptionsInput: ResolverTypeWrapper<ILimitOptionsInput>;
  LogOptions: ResolverTypeWrapper<ILogOptions>;
  LogOptionsInput: ResolverTypeWrapper<ILogOptionsInput>;
  ModelOptions: ResolverTypeWrapper<IModelOptions>;
  ModelOptionsInput: ResolverTypeWrapper<IModelOptionsInput>;
  MongoId: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['MongoId']>;
  MongoIdMeybe: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['MongoIdMeybe']>;
  MongoOperationType: IMongoOperationType;
  MongoStream: ResolverTypeWrapper<Omit<IMongoStream, 'documentKey'> & { documentKey: IResolversTypes['MongoId'] }>;
  MongoStreamInput: IMongoStreamInput;
  MongoStreamNameSpace: ResolverTypeWrapper<IMongoStreamNameSpace>;
  MongoStreamUpdateDescription: ResolverTypeWrapper<IMongoStreamUpdateDescription>;
  MongoTimeStamps: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['MongoTimeStamps']>;
  MongoTimeStampsMeybe: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['MongoTimeStampsMeybe']>;
  MongoTimeStampsType: ResolverTypeWrapper<IMongoTimeStampsType>;
  MongoUpdateRes: ResolverTypeWrapper<IMongoUpdateRes>;
  Mutation: ResolverTypeWrapper<{}>;
  MySqlRes: ResolverTypeWrapper<IMySqlRes>;
  Object: ResolverTypeWrapper<Scalars['Object']['output']>;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  PackageOptions: ResolverTypeWrapper<IPackageOptions>;
  Packages: ResolverTypeWrapper<Scalars['Packages']['output']>;
  Pagination: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['Pagination']>;
  PermissionType: IPermissionType;
  Query: ResolverTypeWrapper<{}>;
  RoleConfigDataDocument: ResolverTypeWrapper<IRoleConfigDataDocument>;
  RoleConfigDataInput: ResolverTypeWrapper<Omit<IRoleConfigDataInput, 'resource_access'> & { resource_access: Array<IResolversTypes['AccessInput']> }>;
  RoleConfigDocument: ResolverTypeWrapper<IRoleConfigDocument>;
  RoleConfigInput: ResolverTypeWrapper<Omit<IRoleConfigInput, 'data'> & { data: IResolversTypes['RoleConfigDataInput'] }>;
  SearchInput: ISearchInput;
  SearchScore: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['SearchScore']>;
  ServerAccess: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['ServerAccess']>;
  ServerMethod: IServerMethod;
  ServerType: IServerType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  TimeZoneDocument: ResolverTypeWrapper<ITimeZoneDocument>;
  TimeZoneInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['TimeZoneInput']>;
  TimeZonePagination: ResolverTypeWrapper<ITimeZonePagination>;
  TimeZoneSearch: ResolverTypeWrapper<ITimeZoneSearch>;
  TokenType: ITokenType;
  UserDocument: ResolverTypeWrapper<IUserDocument>;
  UserInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['UserInput']>;
  UserOutput: ResolverTypeWrapper<IUserOutput>;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  AccessDocument: IAccessDocument;
  AccessInput: IResolversInterfaceTypes<IResolversParentTypes>['AccessInput'];
  AccessOptions: IAccessOptions;
  AccessOptionsInput: IAccessOptionsInput;
  AdminOptions: IAdminOptions;
  AdminOptionsInput: IAdminOptionsInput;
  AuthOptions: IAuthOptions;
  AuthOptionsInput: IAuthOptionsInput;
  Boolean: Scalars['Boolean']['output'];
  CaptchaOptions: ICaptchaOptions;
  CaptchaOptionsInput: ICaptchaOptionsInput;
  ConfigBase: IConfigBase;
  ConfigDocument: IConfigDocument;
  ConfigDocumentBase: IConfigDocumentBase;
  ConfigInput: IConfigInput;
  ConfigOutput: IConfigOutput;
  ConfigPagination: IConfigPagination;
  ConfigSearch: IConfigSearch;
  CountryDocument: ICountryDocument;
  CountryInput: IResolversInterfaceTypes<IResolversParentTypes>['CountryInput'];
  CountryPagination: ICountryPagination;
  CountrySearch: ICountrySearch;
  CountryUpdate: ICountryUpdate;
  DateTime: Scalars['DateTime']['output'];
  DefaultAccessOptions: IDefaultAccessOptions;
  Enabled: IResolversInterfaceTypes<IResolversParentTypes>['Enabled'];
  EnabledMeybe: IResolversInterfaceTypes<IResolversParentTypes>['EnabledMeybe'];
  Float: Scalars['Float']['output'];
  GraphqlAccess: IGraphqlAccess;
  Int: Scalars['Int']['output'];
  JobActionDocument: Omit<IJobActionDocument, 'steps'> & { steps: Array<IResolversParentTypes['JobStepInput']> };
  JobActionInput: IResolversInterfaceTypes<IResolversParentTypes>['JobActionInput'];
  JobActionPagination: Omit<IJobActionPagination, 'list'> & { list: Array<IResolversParentTypes['JobActionSearch']> };
  JobActionSearch: Omit<IJobActionSearch, 'steps'> & { steps: Array<IResolversParentTypes['JobStepInput']> };
  JobBase: IResolversInterfaceTypes<IResolversParentTypes>['JobBase'];
  JobDocument: IJobDocument;
  JobInput: IResolversInterfaceTypes<IResolversParentTypes>['JobInput'];
  JobPagination: IJobPagination;
  JobSearch: IJobSearch;
  JobStepInput: IResolversInterfaceTypes<IResolversParentTypes>['JobStepInput'];
  LimitOptions: ILimitOptions;
  LimitOptionsInput: ILimitOptionsInput;
  LogOptions: ILogOptions;
  LogOptionsInput: ILogOptionsInput;
  ModelOptions: IModelOptions;
  ModelOptionsInput: IModelOptionsInput;
  MongoId: IResolversInterfaceTypes<IResolversParentTypes>['MongoId'];
  MongoIdMeybe: IResolversInterfaceTypes<IResolversParentTypes>['MongoIdMeybe'];
  MongoStream: Omit<IMongoStream, 'documentKey'> & { documentKey: IResolversParentTypes['MongoId'] };
  MongoStreamInput: IMongoStreamInput;
  MongoStreamNameSpace: IMongoStreamNameSpace;
  MongoStreamUpdateDescription: IMongoStreamUpdateDescription;
  MongoTimeStamps: IResolversInterfaceTypes<IResolversParentTypes>['MongoTimeStamps'];
  MongoTimeStampsMeybe: IResolversInterfaceTypes<IResolversParentTypes>['MongoTimeStampsMeybe'];
  MongoTimeStampsType: IMongoTimeStampsType;
  MongoUpdateRes: IMongoUpdateRes;
  Mutation: {};
  MySqlRes: IMySqlRes;
  Object: Scalars['Object']['output'];
  ObjectId: Scalars['ObjectId']['output'];
  PackageOptions: IPackageOptions;
  Packages: Scalars['Packages']['output'];
  Pagination: IResolversInterfaceTypes<IResolversParentTypes>['Pagination'];
  Query: {};
  RoleConfigDataDocument: IRoleConfigDataDocument;
  RoleConfigDataInput: Omit<IRoleConfigDataInput, 'resource_access'> & { resource_access: Array<IResolversParentTypes['AccessInput']> };
  RoleConfigDocument: IRoleConfigDocument;
  RoleConfigInput: Omit<IRoleConfigInput, 'data'> & { data: IResolversParentTypes['RoleConfigDataInput'] };
  SearchInput: ISearchInput;
  SearchScore: IResolversInterfaceTypes<IResolversParentTypes>['SearchScore'];
  ServerAccess: IResolversInterfaceTypes<IResolversParentTypes>['ServerAccess'];
  String: Scalars['String']['output'];
  Subscription: {};
  TimeZoneDocument: ITimeZoneDocument;
  TimeZoneInput: IResolversInterfaceTypes<IResolversParentTypes>['TimeZoneInput'];
  TimeZonePagination: ITimeZonePagination;
  TimeZoneSearch: ITimeZoneSearch;
  UserDocument: IUserDocument;
  UserInput: IResolversInterfaceTypes<IResolversParentTypes>['UserInput'];
  UserOutput: IUserOutput;
};

export type IAccessDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['AccessDocument'] = IResolversParentTypes['AccessDocument']> = {
  action?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['DateTime']>, ParentType, ContextType>;
  created_by?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  permissions?: Resolver<Array<IResolversTypes['PermissionType']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<IResolversTypes['AccessStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['DateTime']>, ParentType, ContextType>;
  updated_by?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAccessInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['AccessInput'] = IResolversParentTypes['AccessInput']> = {
  __resolveType: TypeResolveFn<'AccessDocument', ParentType, ContextType>;
  action?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  created_by?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  permissions?: Resolver<Array<IResolversTypes['PermissionType']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<IResolversTypes['AccessStatus'], ParentType, ContextType>;
  updated_by?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
};

export type IAccessOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['AccessOptions'] = IResolversParentTypes['AccessOptions']> = {
  action?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  admin?: Resolver<Maybe<IResolversTypes['AdminOptions']>, ParentType, ContextType>;
  auth?: Resolver<Maybe<IResolversTypes['AuthOptions']>, ParentType, ContextType>;
  captcha?: Resolver<Maybe<IResolversTypes['CaptchaOptions']>, ParentType, ContextType>;
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  info?: Resolver<Maybe<Array<Maybe<IResolversTypes['String']>>>, ParentType, ContextType>;
  limit?: Resolver<Maybe<IResolversTypes['LimitOptions']>, ParentType, ContextType>;
  log?: Resolver<IResolversTypes['LogOptions'], ParentType, ContextType>;
  model?: Resolver<Maybe<IResolversTypes['ModelOptions']>, ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  permission?: Resolver<Maybe<IResolversTypes['PermissionType']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  resourceAction?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAccessOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['AccessOptionsInput'] = IResolversParentTypes['AccessOptionsInput']> = {
  admin?: Resolver<Maybe<IResolversTypes['AdminOptionsInput']>, ParentType, ContextType>;
  auth?: Resolver<Maybe<IResolversTypes['AuthOptionsInput']>, ParentType, ContextType>;
  captcha?: Resolver<Maybe<IResolversTypes['CaptchaOptionsInput']>, ParentType, ContextType>;
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  info?: Resolver<Maybe<Array<Maybe<IResolversTypes['String']>>>, ParentType, ContextType>;
  limit?: Resolver<Maybe<IResolversTypes['LimitOptionsInput']>, ParentType, ContextType>;
  log?: Resolver<Maybe<IResolversTypes['LogOptionsInput']>, ParentType, ContextType>;
  model?: Resolver<Maybe<IResolversTypes['ModelOptionsInput']>, ParentType, ContextType>;
  permission?: Resolver<Maybe<IResolversTypes['PermissionType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAdminOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['AdminOptions'] = IResolversParentTypes['AdminOptions']> = {
  app?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  hash?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  iframe?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAdminOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['AdminOptionsInput'] = IResolversParentTypes['AdminOptionsInput']> = {
  app?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  hash?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  iframe?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAuthOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['AuthOptions'] = IResolversParentTypes['AuthOptions']> = {
  authParamKeyName?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  tokens?: Resolver<Array<IResolversTypes['TokenType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAuthOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['AuthOptionsInput'] = IResolversParentTypes['AuthOptionsInput']> = {
  authParamKeyName?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  tokens?: Resolver<Array<IResolversTypes['TokenType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICaptchaOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['CaptchaOptions'] = IResolversParentTypes['CaptchaOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICaptchaOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['CaptchaOptionsInput'] = IResolversParentTypes['CaptchaOptionsInput']> = {
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IConfigBaseResolvers<ContextType = any, ParentType extends IResolversParentTypes['ConfigBase'] = IResolversParentTypes['ConfigBase']> = {
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IConfigDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['ConfigDocument'] = IResolversParentTypes['ConfigDocument']> = {
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  log?: Resolver<IResolversTypes['LogOptions'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IConfigDocumentBaseResolvers<ContextType = any, ParentType extends IResolversParentTypes['ConfigDocumentBase'] = IResolversParentTypes['ConfigDocumentBase']> = {
  log?: Resolver<IResolversTypes['LogOptions'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IConfigInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['ConfigInput'] = IResolversParentTypes['ConfigInput']> = {
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  log?: Resolver<Maybe<IResolversTypes['LogOptionsInput']>, ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IConfigOutputResolvers<ContextType = any, ParentType extends IResolversParentTypes['ConfigOutput'] = IResolversParentTypes['ConfigOutput']> = {
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  log?: Resolver<IResolversTypes['LogOptions'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IConfigPaginationResolvers<ContextType = any, ParentType extends IResolversParentTypes['ConfigPagination'] = IResolversParentTypes['ConfigPagination']> = {
  list?: Resolver<Array<IResolversTypes['ConfigSearch']>, ParentType, ContextType>;
  total?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IConfigSearchResolvers<ContextType = any, ParentType extends IResolversParentTypes['ConfigSearch'] = IResolversParentTypes['ConfigSearch']> = {
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  log?: Resolver<IResolversTypes['LogOptions'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  score?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICountryDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['CountryDocument'] = IResolversParentTypes['CountryDocument']> = {
  alpha2?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  alpha3?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  area?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  gdp?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  population?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  timezones?: Resolver<Array<IResolversTypes['TimeZoneDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICountryInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['CountryInput'] = IResolversParentTypes['CountryInput']> = {
  __resolveType: TypeResolveFn<'CountryDocument', ParentType, ContextType>;
  alpha2?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  alpha3?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  area?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  gdp?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  population?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
};

export type ICountryPaginationResolvers<ContextType = any, ParentType extends IResolversParentTypes['CountryPagination'] = IResolversParentTypes['CountryPagination']> = {
  list?: Resolver<Array<IResolversTypes['CountrySearch']>, ParentType, ContextType>;
  total?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICountrySearchResolvers<ContextType = any, ParentType extends IResolversParentTypes['CountrySearch'] = IResolversParentTypes['CountrySearch']> = {
  alpha2?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  alpha3?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  area?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  gdp?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  population?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  score?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  timezones?: Resolver<Array<IResolversTypes['TimeZoneDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IDateTimeScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type IDefaultAccessOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['DefaultAccessOptions'] = IResolversParentTypes['DefaultAccessOptions']> = {
  action?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  resource?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  resourceAction?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IEnabledResolvers<ContextType = any, ParentType extends IResolversParentTypes['Enabled'] = IResolversParentTypes['Enabled']> = {
  __resolveType: TypeResolveFn<'AccessOptions' | 'AuthOptions' | 'CaptchaOptions' | 'LimitOptions' | 'LogOptions' | 'ModelOptions', ParentType, ContextType>;
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
};

export type IEnabledMeybeResolvers<ContextType = any, ParentType extends IResolversParentTypes['EnabledMeybe'] = IResolversParentTypes['EnabledMeybe']> = {
  __resolveType: TypeResolveFn<'AccessOptionsInput' | 'AuthOptionsInput' | 'CaptchaOptionsInput' | 'LimitOptionsInput' | 'LogOptionsInput' | 'ModelOptionsInput', ParentType, ContextType>;
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type IGraphqlAccessResolvers<ContextType = any, ParentType extends IResolversParentTypes['GraphqlAccess'] = IResolversParentTypes['GraphqlAccess']> = {
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  services?: Resolver<Array<IResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobActionDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobActionDocument'] = IResolversParentTypes['JobActionDocument']> = {
  _id?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  job_id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  steps?: Resolver<Array<IResolversTypes['JobStepInput']>, ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobActionInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobActionInput'] = IResolversParentTypes['JobActionInput']> = {
  __resolveType: TypeResolveFn<'JobActionDocument' | 'JobActionSearch', ParentType, ContextType>;
  job_id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  steps?: Resolver<Array<IResolversTypes['JobStepInput']>, ParentType, ContextType>;
};

export type IJobActionPaginationResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobActionPagination'] = IResolversParentTypes['JobActionPagination']> = {
  list?: Resolver<Array<IResolversTypes['JobActionSearch']>, ParentType, ContextType>;
  total?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobActionSearchResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobActionSearch'] = IResolversParentTypes['JobActionSearch']> = {
  _id?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  job_id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  score?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  steps?: Resolver<Array<IResolversTypes['JobStepInput']>, ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobBaseResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobBase'] = IResolversParentTypes['JobBase']> = {
  __resolveType: TypeResolveFn<'JobDocument' | 'JobSearch', ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  cron?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  description?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  params?: Resolver<IResolversTypes['Object'], ParentType, ContextType>;
  parent_id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  status?: Resolver<IResolversTypes['JobStatus'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
};

export type IJobDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobDocument'] = IResolversParentTypes['JobDocument']> = {
  _id?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  cron?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  description?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  error?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  log?: Resolver<IResolversTypes['LogOptions'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  params?: Resolver<IResolversTypes['Object'], ParentType, ContextType>;
  parent_id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  run_on_startup?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<IResolversTypes['JobStatus'], ParentType, ContextType>;
  time_zone?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobInput'] = IResolversParentTypes['JobInput']> = {
  __resolveType: TypeResolveFn<'JobSearch', ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  cron?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  description?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  log?: Resolver<Maybe<IResolversTypes['LogOptionsInput']>, ParentType, ContextType>;
  params?: Resolver<IResolversTypes['Object'], ParentType, ContextType>;
  parent_id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  run_on_startup?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  status?: Resolver<IResolversTypes['JobStatus'], ParentType, ContextType>;
  time_zone?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
};

export type IJobPaginationResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobPagination'] = IResolversParentTypes['JobPagination']> = {
  list?: Resolver<Array<IResolversTypes['JobSearch']>, ParentType, ContextType>;
  total?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobSearchResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobSearch'] = IResolversParentTypes['JobSearch']> = {
  _id?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  cron?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  description?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  log?: Resolver<Maybe<IResolversTypes['LogOptionsInput']>, ParentType, ContextType>;
  params?: Resolver<IResolversTypes['Object'], ParentType, ContextType>;
  parent_id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  run_on_startup?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  score?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  status?: Resolver<IResolversTypes['JobStatus'], ParentType, ContextType>;
  time_zone?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobStepInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['JobStepInput'] = IResolversParentTypes['JobStepInput']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  data?: Resolver<IResolversTypes['Object'], ParentType, ContextType>;
  error?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  identifier?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<IResolversTypes['JobStepStatus'], ParentType, ContextType>;
};

export type ILimitOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['LimitOptions'] = IResolversParentTypes['LimitOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  limitInterval?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  limitTreshold?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ILimitOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['LimitOptionsInput'] = IResolversParentTypes['LimitOptionsInput']> = {
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  limitInterval?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  limitTreshold?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ILogOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['LogOptions'] = IResolversParentTypes['LogOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ILogOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['LogOptionsInput'] = IResolversParentTypes['LogOptionsInput']> = {
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  max?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IModelOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['ModelOptions'] = IResolversParentTypes['ModelOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  mongoose?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IModelOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['ModelOptionsInput'] = IResolversParentTypes['ModelOptionsInput']> = {
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  mongoose?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMongoIdResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoId'] = IResolversParentTypes['MongoId']> = {
  __resolveType: TypeResolveFn<'JobActionDocument' | 'JobActionSearch' | 'JobDocument' | 'JobSearch' | 'UserDocument' | 'UserOutput', ParentType, ContextType>;
  _id?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
};

export type IMongoIdMeybeResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoIdMeybe'] = IResolversParentTypes['MongoIdMeybe']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
};

export type IMongoStreamResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoStream'] = IResolversParentTypes['MongoStream']> = {
  documentKey?: Resolver<IResolversTypes['MongoId'], ParentType, ContextType>;
  fullDocument?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  fullDocumentBeforeChange?: Resolver<Maybe<IResolversTypes['Object']>, ParentType, ContextType>;
  ns?: Resolver<IResolversTypes['MongoStreamNameSpace'], ParentType, ContextType>;
  operationType?: Resolver<IResolversTypes['MongoOperationType'], ParentType, ContextType>;
  updateDescription?: Resolver<Maybe<IResolversTypes['MongoStreamUpdateDescription']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMongoStreamNameSpaceResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoStreamNameSpace'] = IResolversParentTypes['MongoStreamNameSpace']> = {
  coll?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  db?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMongoStreamUpdateDescriptionResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoStreamUpdateDescription'] = IResolversParentTypes['MongoStreamUpdateDescription']> = {
  removedFields?: Resolver<Array<IResolversTypes['String']>, ParentType, ContextType>;
  truncatedArrays?: Resolver<Array<IResolversTypes['String']>, ParentType, ContextType>;
  updatedFields?: Resolver<IResolversTypes['Object'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMongoTimeStampsResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoTimeStamps'] = IResolversParentTypes['MongoTimeStamps']> = {
  __resolveType: TypeResolveFn<'ConfigOutput' | 'ConfigSearch' | 'JobActionDocument' | 'JobActionSearch' | 'JobDocument' | 'JobSearch' | 'MongoTimeStampsType' | 'RoleConfigDocument' | 'UserDocument' | 'UserOutput', ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
};

export type IMongoTimeStampsMeybeResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoTimeStampsMeybe'] = IResolversParentTypes['MongoTimeStampsMeybe']> = {
  __resolveType: TypeResolveFn<'AccessDocument', ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type IMongoTimeStampsTypeResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoTimeStampsType'] = IResolversParentTypes['MongoTimeStampsType']> = {
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMongoUpdateResResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoUpdateRes'] = IResolversParentTypes['MongoUpdateRes']> = {
  acknowledged?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  matchedCount?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  modifiedCount?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  upsertedCount?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  upsertedId?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMutationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  _?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type IMySqlResResolvers<ContextType = any, ParentType extends IResolversParentTypes['MySqlRes'] = IResolversParentTypes['MySqlRes']> = {
  affectedRows?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  changedRows?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  fieldCount?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  insertId?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  message?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  protocol41?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  serverStatus?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  warningCount?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IObjectScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Object'], any> {
  name: 'Object';
}

export interface IObjectIdScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type IPackageOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['PackageOptions'] = IResolversParentTypes['PackageOptions']> = {
  alias?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  haproxy_rewrite?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  next_disable_alias?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  version?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IPackagesScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Packages'], any> {
  name: 'Packages';
}

export type IPaginationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Pagination'] = IResolversParentTypes['Pagination']> = {
  __resolveType: TypeResolveFn<'ConfigPagination' | 'CountryPagination' | 'JobActionPagination' | 'JobPagination' | 'TimeZonePagination', ParentType, ContextType>;
  total?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
};

export type IQueryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']> = {
  _?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  getAllAccessConfigs?: Resolver<Array<IResolversTypes['AccessOptions']>, ParentType, ContextType>;
  getAllPackageConfigs?: Resolver<Array<IResolversTypes['PackageOptions']>, ParentType, ContextType>;
  getAllRoles?: Resolver<Maybe<Array<IResolversTypes['RoleConfigDocument']>>, ParentType, ContextType>;
  getConfig?: Resolver<Maybe<IResolversTypes['ConfigOutput']>, ParentType, ContextType, RequireFields<IQueryGetConfigArgs, 'id'>>;
  getCountry?: Resolver<Maybe<IResolversTypes['CountryDocument']>, ParentType, ContextType, RequireFields<IQueryGetCountryArgs, 'alpha2'>>;
  getCurrentUser?: Resolver<Maybe<IResolversTypes['UserOutput']>, ParentType, ContextType>;
  getJob?: Resolver<Maybe<IResolversTypes['JobDocument']>, ParentType, ContextType, RequireFields<IQueryGetJobArgs, 'id'>>;
  getUser?: Resolver<Maybe<IResolversTypes['UserOutput']>, ParentType, ContextType, RequireFields<IQueryGetUserArgs, 'id'>>;
  searchConfigs?: Resolver<Maybe<IResolversTypes['ConfigPagination']>, ParentType, ContextType, RequireFields<IQuerySearchConfigsArgs, 'search'>>;
  searchCountry?: Resolver<Array<IResolversTypes['CountrySearch']>, ParentType, ContextType, Partial<IQuerySearchCountryArgs>>;
  searchJob?: Resolver<Maybe<IResolversTypes['JobPagination']>, ParentType, ContextType, Partial<IQuerySearchJobArgs>>;
  searchTimezone?: Resolver<Array<IResolversTypes['TimeZoneSearch']>, ParentType, ContextType, Partial<IQuerySearchTimezoneArgs>>;
};

export type IRoleConfigDataDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['RoleConfigDataDocument'] = IResolversParentTypes['RoleConfigDataDocument']> = {
  graphql_access?: Resolver<Array<IResolversTypes['GraphqlAccess']>, ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  resource_access?: Resolver<Array<IResolversTypes['AccessDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IRoleConfigDataInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['RoleConfigDataInput'] = IResolversParentTypes['RoleConfigDataInput']> = {
  graphql_access?: Resolver<Array<IResolversTypes['GraphqlAccess']>, ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  resource_access?: Resolver<Array<IResolversTypes['AccessInput']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IRoleConfigDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['RoleConfigDocument'] = IResolversParentTypes['RoleConfigDocument']> = {
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  data?: Resolver<IResolversTypes['RoleConfigDataDocument'], ParentType, ContextType>;
  log?: Resolver<IResolversTypes['LogOptions'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IRoleConfigInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['RoleConfigInput'] = IResolversParentTypes['RoleConfigInput']> = {
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  created_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  data?: Resolver<IResolversTypes['RoleConfigDataInput'], ParentType, ContextType>;
  log?: Resolver<Maybe<IResolversTypes['LogOptionsInput']>, ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updated_by?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ISearchScoreResolvers<ContextType = any, ParentType extends IResolversParentTypes['SearchScore'] = IResolversParentTypes['SearchScore']> = {
  __resolveType: TypeResolveFn<'ConfigSearch' | 'CountrySearch' | 'JobActionSearch' | 'JobSearch' | 'TimeZoneSearch', ParentType, ContextType>;
  score?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
};

export type IServerAccessResolvers<ContextType = any, ParentType extends IResolversParentTypes['ServerAccess'] = IResolversParentTypes['ServerAccess']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  path?: Resolver<Array<IResolversTypes['String']>, ParentType, ContextType>;
  serverMethod?: Resolver<IResolversTypes['ServerMethod'], ParentType, ContextType>;
  serverType?: Resolver<IResolversTypes['ServerType'], ParentType, ContextType>;
};

export type ISubscriptionResolvers<ContextType = any, ParentType extends IResolversParentTypes['Subscription'] = IResolversParentTypes['Subscription']> = {
  _?: SubscriptionResolver<Maybe<IResolversTypes['Boolean']>, "_", ParentType, ContextType>;
  streamConfig?: SubscriptionResolver<Maybe<IResolversTypes['MongoStream']>, "streamConfig", ParentType, ContextType, RequireFields<ISubscriptionStreamConfigArgs, 'stream'>>;
  streamJob?: SubscriptionResolver<Maybe<IResolversTypes['MongoStream']>, "streamJob", ParentType, ContextType, RequireFields<ISubscriptionStreamJobArgs, 'stream'>>;
  streamJobAction?: SubscriptionResolver<Maybe<IResolversTypes['MongoStream']>, "streamJobAction", ParentType, ContextType, RequireFields<ISubscriptionStreamJobActionArgs, 'stream'>>;
};

export type ITimeZoneDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['TimeZoneDocument'] = IResolversParentTypes['TimeZoneDocument']> = {
  alpha2?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  dst?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  std?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ITimeZoneInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['TimeZoneInput'] = IResolversParentTypes['TimeZoneInput']> = {
  __resolveType: TypeResolveFn<'TimeZoneDocument', ParentType, ContextType>;
  alpha2?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  dst?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  std?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
};

export type ITimeZonePaginationResolvers<ContextType = any, ParentType extends IResolversParentTypes['TimeZonePagination'] = IResolversParentTypes['TimeZonePagination']> = {
  list?: Resolver<Array<IResolversTypes['TimeZoneSearch']>, ParentType, ContextType>;
  total?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ITimeZoneSearchResolvers<ContextType = any, ParentType extends IResolversParentTypes['TimeZoneSearch'] = IResolversParentTypes['TimeZoneSearch']> = {
  alpha2?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  dst?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  std?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserDocument'] = IResolversParentTypes['UserDocument']> = {
  _id?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  psw?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  roles?: Resolver<Array<IResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  usn?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserInput'] = IResolversParentTypes['UserInput']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  _id?: Resolver<Maybe<IResolversTypes['ObjectId']>, ParentType, ContextType>;
  psw?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  roles?: Resolver<Array<IResolversTypes['String']>, ParentType, ContextType>;
  usn?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
};

export type IUserOutputResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserOutput'] = IResolversParentTypes['UserOutput']> = {
  _id?: Resolver<IResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<IResolversTypes['RoleConfigDocument']>>, ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  usn?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IResolvers<ContextType = any> = {
  AccessDocument?: IAccessDocumentResolvers<ContextType>;
  AccessInput?: IAccessInputResolvers<ContextType>;
  AccessOptions?: IAccessOptionsResolvers<ContextType>;
  AccessOptionsInput?: IAccessOptionsInputResolvers<ContextType>;
  AdminOptions?: IAdminOptionsResolvers<ContextType>;
  AdminOptionsInput?: IAdminOptionsInputResolvers<ContextType>;
  AuthOptions?: IAuthOptionsResolvers<ContextType>;
  AuthOptionsInput?: IAuthOptionsInputResolvers<ContextType>;
  CaptchaOptions?: ICaptchaOptionsResolvers<ContextType>;
  CaptchaOptionsInput?: ICaptchaOptionsInputResolvers<ContextType>;
  ConfigBase?: IConfigBaseResolvers<ContextType>;
  ConfigDocument?: IConfigDocumentResolvers<ContextType>;
  ConfigDocumentBase?: IConfigDocumentBaseResolvers<ContextType>;
  ConfigInput?: IConfigInputResolvers<ContextType>;
  ConfigOutput?: IConfigOutputResolvers<ContextType>;
  ConfigPagination?: IConfigPaginationResolvers<ContextType>;
  ConfigSearch?: IConfigSearchResolvers<ContextType>;
  CountryDocument?: ICountryDocumentResolvers<ContextType>;
  CountryInput?: ICountryInputResolvers<ContextType>;
  CountryPagination?: ICountryPaginationResolvers<ContextType>;
  CountrySearch?: ICountrySearchResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DefaultAccessOptions?: IDefaultAccessOptionsResolvers<ContextType>;
  Enabled?: IEnabledResolvers<ContextType>;
  EnabledMeybe?: IEnabledMeybeResolvers<ContextType>;
  GraphqlAccess?: IGraphqlAccessResolvers<ContextType>;
  JobActionDocument?: IJobActionDocumentResolvers<ContextType>;
  JobActionInput?: IJobActionInputResolvers<ContextType>;
  JobActionPagination?: IJobActionPaginationResolvers<ContextType>;
  JobActionSearch?: IJobActionSearchResolvers<ContextType>;
  JobBase?: IJobBaseResolvers<ContextType>;
  JobDocument?: IJobDocumentResolvers<ContextType>;
  JobInput?: IJobInputResolvers<ContextType>;
  JobPagination?: IJobPaginationResolvers<ContextType>;
  JobSearch?: IJobSearchResolvers<ContextType>;
  JobStepInput?: IJobStepInputResolvers<ContextType>;
  LimitOptions?: ILimitOptionsResolvers<ContextType>;
  LimitOptionsInput?: ILimitOptionsInputResolvers<ContextType>;
  LogOptions?: ILogOptionsResolvers<ContextType>;
  LogOptionsInput?: ILogOptionsInputResolvers<ContextType>;
  ModelOptions?: IModelOptionsResolvers<ContextType>;
  ModelOptionsInput?: IModelOptionsInputResolvers<ContextType>;
  MongoId?: IMongoIdResolvers<ContextType>;
  MongoIdMeybe?: IMongoIdMeybeResolvers<ContextType>;
  MongoStream?: IMongoStreamResolvers<ContextType>;
  MongoStreamNameSpace?: IMongoStreamNameSpaceResolvers<ContextType>;
  MongoStreamUpdateDescription?: IMongoStreamUpdateDescriptionResolvers<ContextType>;
  MongoTimeStamps?: IMongoTimeStampsResolvers<ContextType>;
  MongoTimeStampsMeybe?: IMongoTimeStampsMeybeResolvers<ContextType>;
  MongoTimeStampsType?: IMongoTimeStampsTypeResolvers<ContextType>;
  MongoUpdateRes?: IMongoUpdateResResolvers<ContextType>;
  Mutation?: IMutationResolvers<ContextType>;
  MySqlRes?: IMySqlResResolvers<ContextType>;
  Object?: GraphQLScalarType;
  ObjectId?: GraphQLScalarType;
  PackageOptions?: IPackageOptionsResolvers<ContextType>;
  Packages?: GraphQLScalarType;
  Pagination?: IPaginationResolvers<ContextType>;
  Query?: IQueryResolvers<ContextType>;
  RoleConfigDataDocument?: IRoleConfigDataDocumentResolvers<ContextType>;
  RoleConfigDataInput?: IRoleConfigDataInputResolvers<ContextType>;
  RoleConfigDocument?: IRoleConfigDocumentResolvers<ContextType>;
  RoleConfigInput?: IRoleConfigInputResolvers<ContextType>;
  SearchScore?: ISearchScoreResolvers<ContextType>;
  ServerAccess?: IServerAccessResolvers<ContextType>;
  Subscription?: ISubscriptionResolvers<ContextType>;
  TimeZoneDocument?: ITimeZoneDocumentResolvers<ContextType>;
  TimeZoneInput?: ITimeZoneInputResolvers<ContextType>;
  TimeZonePagination?: ITimeZonePaginationResolvers<ContextType>;
  TimeZoneSearch?: ITimeZoneSearchResolvers<ContextType>;
  UserDocument?: IUserDocumentResolvers<ContextType>;
  UserInput?: IUserInputResolvers<ContextType>;
  UserOutput?: IUserOutputResolvers<ContextType>;
};



export const GetRoleManagerDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRoleManagerData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPackageConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAllAccessConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceAction"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"permission"}},{"kind":"Field","name":{"kind":"Name","value":"limit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"log"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"}}]}},{"kind":"Field","name":{"kind":"Name","value":"captcha"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"model"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mongoose"}}]}},{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"}},{"kind":"Field","name":{"kind":"Name","value":"iframe"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAllRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"updated_by"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"resource_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"updated_by"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graphql_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"services"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<IGetRoleManagerDataQuery, IGetRoleManagerDataQueryVariables>;
export const GetAdminDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAdminData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"usn"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"resource_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graphql_access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"}},{"kind":"Field","name":{"kind":"Name","value":"services"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<IGetAdminDataQuery, IGetAdminDataQueryVariables>;

            // additional types generated by build-graphql.js script!
            export type GraphqlResolvers = Record<IGraphqlMethod, Record<string, any>>

            export type GraphObj = Scalars["Object"]["input"]

            type GraphqlResources<T extends GraphqlResolvers> = {
                [K in IGraphqlMethod]?: {
                    [K2 in keyof T[K]]?: IAccessOptions  
                } 
            }

            export type Resources<T> = GraphqlResources<DeepRequired<IResolvers<T>>>
        