/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "#graphql\n  query getRoleManagerData {\n    getAllPackageConfigs {\n      pack\n      alias\n      version\n    }\n    getAllAccessConfigs {\n      enabled\n      resource\n      pack\n      action\n      resourceAction\n      info\n      permission\n      limit {\n        enabled\n      }\n      log {\n        enabled\n      }\n      auth {\n        enabled\n        tokens\n      }\n      captcha {\n        enabled\n      }\n      model {\n        mongoose\n      }\n      admin {\n        app\n        iframe\n        title\n      }\n    }\n    getAllRoles {\n      _id\n      title\n      created_by\n      updated_by\n      pack\n      type\n      data {\n        name\n        resource_access {\n          status\n          pack\n          resource\n          action\n          permissions\n          created_by\n          updated_by\n          createdAt\n          updatedAt\n        }\n        graphql_access {\n          pack\n          services\n        }\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetRoleManagerDataDocument,
    "#graphql\n  query getAdminData {\n    getCurrentUser {\n      _id\n      usn\n      roles {\n        _id\n        title\n        pack\n        type\n        data {\n          name\n          resource_access {\n            status\n            pack\n            resource\n            action\n            permissions\n          }\n          graphql_access {\n            pack\n            services\n          }\n        }\n      }\n    }\n  }\n": types.GetAdminDataDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n  query getRoleManagerData {\n    getAllPackageConfigs {\n      pack\n      alias\n      version\n    }\n    getAllAccessConfigs {\n      enabled\n      resource\n      pack\n      action\n      resourceAction\n      info\n      permission\n      limit {\n        enabled\n      }\n      log {\n        enabled\n      }\n      auth {\n        enabled\n        tokens\n      }\n      captcha {\n        enabled\n      }\n      model {\n        mongoose\n      }\n      admin {\n        app\n        iframe\n        title\n      }\n    }\n    getAllRoles {\n      _id\n      title\n      created_by\n      updated_by\n      pack\n      type\n      data {\n        name\n        resource_access {\n          status\n          pack\n          resource\n          action\n          permissions\n          created_by\n          updated_by\n          createdAt\n          updatedAt\n        }\n        graphql_access {\n          pack\n          services\n        }\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["#graphql\n  query getRoleManagerData {\n    getAllPackageConfigs {\n      pack\n      alias\n      version\n    }\n    getAllAccessConfigs {\n      enabled\n      resource\n      pack\n      action\n      resourceAction\n      info\n      permission\n      limit {\n        enabled\n      }\n      log {\n        enabled\n      }\n      auth {\n        enabled\n        tokens\n      }\n      captcha {\n        enabled\n      }\n      model {\n        mongoose\n      }\n      admin {\n        app\n        iframe\n        title\n      }\n    }\n    getAllRoles {\n      _id\n      title\n      created_by\n      updated_by\n      pack\n      type\n      data {\n        name\n        resource_access {\n          status\n          pack\n          resource\n          action\n          permissions\n          created_by\n          updated_by\n          createdAt\n          updatedAt\n        }\n        graphql_access {\n          pack\n          services\n        }\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n  query getAdminData {\n    getCurrentUser {\n      _id\n      usn\n      roles {\n        _id\n        title\n        pack\n        type\n        data {\n          name\n          resource_access {\n            status\n            pack\n            resource\n            action\n            permissions\n          }\n          graphql_access {\n            pack\n            services\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query getAdminData {\n    getCurrentUser {\n      _id\n      usn\n      roles {\n        _id\n        title\n        pack\n        type\n        data {\n          name\n          resource_access {\n            status\n            pack\n            resource\n            action\n            permissions\n          }\n          graphql_access {\n            pack\n            services\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;