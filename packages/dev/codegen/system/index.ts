
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
  auth?: Maybe<IAuthOptions>;
  captcha?: Maybe<ICaptchaOptions>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  info?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  limit?: Maybe<ILimitOptions>;
  log?: Maybe<ILogOptions>;
  model?: Maybe<IModelOptions>;
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

export interface ICaptchaOptions extends IEnabled {
  enabled: Scalars['Boolean']['output'];
  pack: Scalars['Packages']['output'];
  type: Scalars['String']['output'];
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

export type IGraphqlMethod =
  | 'Mutation'
  | 'Query'
  | 'Subscription';

export interface ILimitOptions extends IEnabled {
  enabled: Scalars['Boolean']['output'];
  limitInterval: Scalars['String']['output'];
  limitTreshold: Scalars['Int']['output'];
}

export interface ILogOptions extends IEnabled {
  enabled: Scalars['Boolean']['output'];
}

export interface ILogOptionsDocument {
  enabled: Scalars['Boolean']['output'];
  max: Scalars['Int']['output'];
}

export interface ILogOptionsInput {
  enabled?: Maybe<Scalars['Boolean']['output']>;
  max?: Maybe<Scalars['Int']['output']>;
}

export interface IModelOptions {
  enabled: Scalars['Boolean']['output'];
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
  getPing?: Maybe<Scalars['Boolean']['output']>;
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
  getPing?: Maybe<Scalars['Boolean']['output']>;
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
  getPing?: Maybe<Scalars['Boolean']['output']>;
}

export type ITokenType =
  | 'ApiKey'
  | 'Basic'
  | 'Bearer'
  | 'Cookie';

export type IGetPingInComponentQueryVariables = Exact<{ [key: string]: never; }>;


export type IGetPingInComponentQuery = { getPing?: boolean | null };

export type IGetPingInSchemaQueryVariables = Exact<{
  ping: Scalars['String']['input'];
}>;


export type IGetPingInSchemaQuery = { getPing?: boolean | null };



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
  Enabled: ( IAccessOptions ) | ( IAuthOptions ) | ( ICaptchaOptions ) | ( ILimitOptions ) | ( ILogOptions );
  EnabledMeybe: ( IAccessOptionsInput );
  LogOptionsDocument: never;
  LogOptionsInput: never;
  MongoId: never;
  MongoIdMeybe: never;
  MongoTimeStamps: ( IMongoTimeStampsType );
  MongoTimeStampsMeybe: ( IAccessDocument );
  Pagination: never;
  SearchScore: never;
  ServerAccess: never;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CaptchaOptions: ResolverTypeWrapper<ICaptchaOptions>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DefaultAccessOptions: ResolverTypeWrapper<IDefaultAccessOptions>;
  Enabled: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['Enabled']>;
  EnabledMeybe: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['EnabledMeybe']>;
  ExpressMethod: IExpressMethod;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GraphqlMethod: IGraphqlMethod;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LimitOptions: ResolverTypeWrapper<ILimitOptions>;
  LogOptions: ResolverTypeWrapper<ILogOptions>;
  LogOptionsDocument: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['LogOptionsDocument']>;
  LogOptionsInput: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['LogOptionsInput']>;
  ModelOptions: ResolverTypeWrapper<IModelOptions>;
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
  SearchInput: ISearchInput;
  SearchScore: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['SearchScore']>;
  ServerAccess: ResolverTypeWrapper<IResolversInterfaceTypes<IResolversTypes>['ServerAccess']>;
  ServerMethod: IServerMethod;
  ServerType: IServerType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  TokenType: ITokenType;
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
  Boolean: Scalars['Boolean']['output'];
  CaptchaOptions: ICaptchaOptions;
  DateTime: Scalars['DateTime']['output'];
  DefaultAccessOptions: IDefaultAccessOptions;
  Enabled: IResolversInterfaceTypes<IResolversParentTypes>['Enabled'];
  EnabledMeybe: IResolversInterfaceTypes<IResolversParentTypes>['EnabledMeybe'];
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  LimitOptions: ILimitOptions;
  LogOptions: ILogOptions;
  LogOptionsDocument: IResolversInterfaceTypes<IResolversParentTypes>['LogOptionsDocument'];
  LogOptionsInput: IResolversInterfaceTypes<IResolversParentTypes>['LogOptionsInput'];
  ModelOptions: IModelOptions;
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
  SearchInput: ISearchInput;
  SearchScore: IResolversInterfaceTypes<IResolversParentTypes>['SearchScore'];
  ServerAccess: IResolversInterfaceTypes<IResolversParentTypes>['ServerAccess'];
  String: Scalars['String']['output'];
  Subscription: {};
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
  auth?: Resolver<Maybe<IResolversTypes['AuthOptions']>, ParentType, ContextType>;
  captcha?: Resolver<Maybe<IResolversTypes['CaptchaOptions']>, ParentType, ContextType>;
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  info?: Resolver<Maybe<Array<Maybe<IResolversTypes['String']>>>, ParentType, ContextType>;
  limit?: Resolver<Maybe<IResolversTypes['LimitOptions']>, ParentType, ContextType>;
  log?: Resolver<Maybe<IResolversTypes['LogOptions']>, ParentType, ContextType>;
  model?: Resolver<Maybe<IResolversTypes['ModelOptions']>, ParentType, ContextType>;
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

export type ICaptchaOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['CaptchaOptions'] = IResolversParentTypes['CaptchaOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  pack?: Resolver<IResolversTypes['Packages'], ParentType, ContextType>;
  type?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'AccessOptions' | 'AuthOptions' | 'CaptchaOptions' | 'LimitOptions' | 'LogOptions', ParentType, ContextType>;
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
};

export type IEnabledMeybeResolvers<ContextType = any, ParentType extends IResolversParentTypes['EnabledMeybe'] = IResolversParentTypes['EnabledMeybe']> = {
  __resolveType: TypeResolveFn<'AccessOptionsInput', ParentType, ContextType>;
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ILimitOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['LimitOptions'] = IResolversParentTypes['LimitOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  limitInterval?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  limitTreshold?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ILogOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['LogOptions'] = IResolversParentTypes['LogOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ILogOptionsDocumentResolvers<ContextType = any, ParentType extends IResolversParentTypes['LogOptionsDocument'] = IResolversParentTypes['LogOptionsDocument']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
};

export type ILogOptionsInputResolvers<ContextType = any, ParentType extends IResolversParentTypes['LogOptionsInput'] = IResolversParentTypes['LogOptionsInput']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  enabled?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  max?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
};

export type IModelOptionsResolvers<ContextType = any, ParentType extends IResolversParentTypes['ModelOptions'] = IResolversParentTypes['ModelOptions']> = {
  enabled?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  mongoose?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMongoIdResolvers<ContextType = any, ParentType extends IResolversParentTypes['MongoId'] = IResolversParentTypes['MongoId']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'MongoTimeStampsType', ParentType, ContextType>;
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
  getPing?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  total?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
};

export type IQueryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']> = {
  _?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  getPing?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ISearchScoreResolvers<ContextType = any, ParentType extends IResolversParentTypes['SearchScore'] = IResolversParentTypes['SearchScore']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
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
  getPing?: SubscriptionResolver<Maybe<IResolversTypes['Boolean']>, "getPing", ParentType, ContextType>;
};

export type IResolvers<ContextType = any> = {
  AccessDocument?: IAccessDocumentResolvers<ContextType>;
  AccessInput?: IAccessInputResolvers<ContextType>;
  AccessOptions?: IAccessOptionsResolvers<ContextType>;
  AccessOptionsInput?: IAccessOptionsInputResolvers<ContextType>;
  AdminOptions?: IAdminOptionsResolvers<ContextType>;
  AdminOptionsInput?: IAdminOptionsInputResolvers<ContextType>;
  AuthOptions?: IAuthOptionsResolvers<ContextType>;
  CaptchaOptions?: ICaptchaOptionsResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DefaultAccessOptions?: IDefaultAccessOptionsResolvers<ContextType>;
  Enabled?: IEnabledResolvers<ContextType>;
  EnabledMeybe?: IEnabledMeybeResolvers<ContextType>;
  LimitOptions?: ILimitOptionsResolvers<ContextType>;
  LogOptions?: ILogOptionsResolvers<ContextType>;
  LogOptionsDocument?: ILogOptionsDocumentResolvers<ContextType>;
  LogOptionsInput?: ILogOptionsInputResolvers<ContextType>;
  ModelOptions?: IModelOptionsResolvers<ContextType>;
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
  SearchScore?: ISearchScoreResolvers<ContextType>;
  ServerAccess?: IServerAccessResolvers<ContextType>;
  Subscription?: ISubscriptionResolvers<ContextType>;
};



export const GetPingInComponentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPingInComponent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPing"}}]}}]} as unknown as DocumentNode<IGetPingInComponentQuery, IGetPingInComponentQueryVariables>;
export const GetPingInSchemaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPingInSchema"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ping"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPing"}}]}}]} as unknown as DocumentNode<IGetPingInSchemaQuery, IGetPingInSchemaQueryVariables>;

            // additional types generated by build-graphql.js script!
            export type GraphqlResolvers = Record<IGraphqlMethod, Record<string, any>>

            export type GraphObj = Scalars["Object"]["input"]

            type GraphqlResources<T extends GraphqlResolvers> = {
                [K in IGraphqlMethod]?: {
                    [K2 in keyof T[K]]?: IAccessOptions  
                } 
            }

            export type Resources<T> = GraphqlResources<DeepRequired<IResolvers<T>>>
        