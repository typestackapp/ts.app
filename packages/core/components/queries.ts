import { graphql } from "@ts.app/core/codegen/admin/client/index"
import * as client from "@ts.app/core/codegen/admin/client/graphql"
import { useQuery } from "@apollo/client"
export { client }
export { useQuery }

export const getRoleManagerData = graphql(`#graphql
  query getRoleManagerData {
    getAllPackageConfigs {
      pack
      alias
      version
    }
    getAllAccessConfigs {
      enabled
      resource
      pack
      action
      resourceAction
      info
      permission
      limit {
        enabled
      }
      log {
        enabled
      }
      auth {
        enabled
        tokens
      }
      captcha {
        enabled
      }
      model {
        mongoose
      }
      admin {
        app
        iframe
        title
      }
    }
    getAllRoles {
      _id
      title
      created_by
      updated_by
      pack
      type
      data {
        name
        resource_access {
          status
          pack
          resource
          action
          permissions
          created_by
          updated_by
          createdAt
          updatedAt
        }
        graphql_access {
          pack
          services
        }
      }
      createdAt
      updatedAt
    }
  }
`)

export const getAdminData = graphql(`#graphql
  query getAdminData {
    getCurrentUser {
      _id
      usn
      roles {
        _id
        title
        pack
        type
        data {
          name
          resource_access {
            status
            pack
            resource
            action
            permissions
          }
          graphql_access {
            pack
            services
          }
        }
      }
    }
  }
`)
