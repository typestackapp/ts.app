
            import type { DeepRequired } from 'utility-types'
            import type { Types as MongooseTypes } from 'mongoose'
            import type { IResolvers, IGraphqlMethod, IAccessOptions } from '@ts.app/dev/codegen/system/index.js'
            

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

export type AccessOptionsInput = EnabledMeybe & {
  __typename?: 'AccessOptionsInput';
  admin?: Maybe<AdminOptionsInput>;
  auth?: Maybe<AuthOptions>;
  captcha?: Maybe<CaptchaOptions>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  info?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  limit?: Maybe<LimitOptions>;
  log?: Maybe<LogOptions>;
  model?: Maybe<ModelOptions>;
  permission?: Maybe<PermissionType>;
};

export enum AccessStatus {
  Disabled = 'Disabled',
  Enabled = 'Enabled'
}

export type AdminOptions = {
  __typename?: 'AdminOptions';
  app?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  hash: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  iframe?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type AdminOptionsInput = {
  __typename?: 'AdminOptionsInput';
  app?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
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

export type EnabledMeybe = {
  enabled?: Maybe<Scalars['Boolean']['output']>;
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

export enum GraphqlMethod {
  Mutation = 'Mutation',
  Query = 'Query',
  Subscription = 'Subscription'
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
  enabled: Scalars['Boolean']['output'];
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
  getPing?: Maybe<Scalars['Boolean']['output']>;
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
  getPing?: Maybe<Scalars['Boolean']['output']>;
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
  getPing?: Maybe<Scalars['Boolean']['output']>;
};

export enum TokenType {
  ApiKey = 'ApiKey',
  Basic = 'Basic',
  Bearer = 'Bearer',
  Cookie = 'Cookie'
}

export type GetPingInComponentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPingInComponentQuery = { __typename?: 'Query', getPing?: boolean | null };

export type GetPingInSchemaQueryVariables = Exact<{
  ping: Scalars['String']['input'];
}>;


export type GetPingInSchemaQuery = { __typename?: 'Query', getPing?: boolean | null };


export const GetPingInComponentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPingInComponent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPing"}}]}}]} as unknown as DocumentNode<GetPingInComponentQuery, GetPingInComponentQueryVariables>;
export const GetPingInSchemaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPingInSchema"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ping"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPing"}}]}}]} as unknown as DocumentNode<GetPingInSchemaQuery, GetPingInSchemaQueryVariables>;

            // additional types generated by build-graphql.js script!
            export type GraphqlResolvers = Record<IGraphqlMethod, Record<string, any>>

            export type GraphObj = Scalars["Object"]["input"]

            type GraphqlResources<T extends GraphqlResolvers> = {
                [K in IGraphqlMethod]?: {
                    [K2 in keyof T[K]]?: IAccessOptions  
                } 
            }

            export type Resources<T> = GraphqlResources<DeepRequired<IResolvers<T>>>
        