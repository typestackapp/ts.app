export default {
    "Country": {
        "getCountry": {},
        "searchCountry": {},
        "searchTimezone": {}
    },
    "Auth": {
        "use": {
            "info": [ "Handle Authentification via trpc" ]
        },
        "app": {
            "info": [ "Returns app data" ],
            "auth": { "tokens": ["Bearer", "Cookie"] }
        },
        "grant": {
            "info": [
                "User grants access to external app",
                "User is redirected to external apps callback",
                "External app can retreive token by using tokenAuthorizationCode"
            ],
            "`auth": { "tokens": ["Bearer"] }
        },
        "authorize": {
            "info": [
                "Authorize external app to access user data",
                "User is redirected to external apps callback",
                "External app can retreive token by using tokenAuthorizationCode"
            ],
            "auth": { "tokens": ["Bearer"] }
        },
        "callback": {
            "info": [
                "User is redirected to this endpoint to add new token to user tokens",
                "Token can be added from internal app or external app",
                "Token retrival is handled by auth client"
            ],
            "auth": { "tokens": ["Bearer"] }
        },
        "revoke": {
            "info": [ 
                "User can revoke session token by providing Authorization Bearer header",
                "User can revoke external app token by providing Authorization Bearer header and token_id"
            ],
            "auth": { "tokens": ["Bearer"] }
        },
        "tokenPassword": {
            "info": [
                "User can retreive new token by providing Basic auth",
                "Header should be set liek this Authorization: Basic base64(email:psw)"
            ],
            "auth": { "tokens": ["Basic"] }
        },
        "tokenSession": {
            "info": [ "For user return new refresh and access token from session cookie" ]
        },
        "tokenAuthorizationCode": {
            "info": [ "For external app grant user token by providing app secret id and token id(code)" ]
        },
        "tokenRefreshToken": {
            "info": [ "For external app grant new toke" ]
        }
    },
    "User": {
        "AccountApp": {
            "admin": { "title": "Account", "app": "@ts.app/core/components/apps/AccountApp.js" },
            "permission": "Read"
        },
        "getCurrentUser": {
            "info": [ "Allows user to get current token holder user data" ],
            "auth": { "tokens": ["Bearer", "Cookie"] },
            "permission": "Read"
        },
        "getUser": {
            "info": [ "Allows user to get any user data by providing user id" ],
            "auth": { "tokens": ["Bearer", "Cookie"] },
            "permission": "Read"
        },
        "getUserRole": {
            "info": [ "Allows user to get users role" ],
            "auth": { "tokens": ["Bearer", "Cookie"] }, 
            "permission": "Read"
        }
    },
    "ApiKey": {
        "ApiKeyApp": {
            "admin": { "title": "API Keys", "app": "@ts.app/core/components/apps/ApiKeyApp.js" },
            "permission": "Read"
        }
    },
    "Pack": {
        "getAllPackageConfigs": {
            "info": [ "Allows user to get all package configs" ],
            "auth": { "tokens": ["Bearer", "Cookie"] },
            "permission": "Read"
        }
    },
    "Access": {
        "getAllAccessConfigs": {
            "info": [ "Allows user to get all access configs" ],
            "auth": { "tokens": ["Bearer", "Cookie"] },
            "permission": "Read"
        }
    },
    "Config": {
        "searchConfigs": {
            "info": [ "Allows user to search for configs with Read permission" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] },
            "model": { "mongoose": "@ts.app/core/models/config" },
            "permission": "Read"
        },
        "getConfig": {
            "info": [ "Allows user to get config with Read permission by providing config id" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] },
            "model": { "mongoose": "@ts.app/core/models/config" },
            "permission": "Read"
        }
    },
    "RoleConfig": {
        "RoleApp": {
            "admin": { "title": "Roles", "app": "@ts.app/core/components/apps/RoleApp.js" },
            "permission": "Read"
        },
        "getAllRoles": {
            "info": [ "Allows user to get all roles" ],
            "auth": { "tokens": ["Bearer", "Cookie"] }, 
            "permission": "Read"
        },
        "upsertRole": {
            "info": [ "Allows user to insert or update role" ],
            "auth": { "tokens": ["Bearer", "Cookie"] },
            "permission": "Write" 
        },
        "deleteRole": {
            "info": [ "Allows user to remove role" ],
            "auth": { "tokens": ["Bearer", "Cookie"] },
            "permission": "Delete" 
        }
    },
    "Job": {
        "searchJobs": {
            "info": [ "Allows user to search for jobs with Read permission" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] }, 
            "model": { "mongoose": "@ts.app/core/models/job" },
            "permission": "Read"
        },
        "getJob": {
            "info": [ "Allows user to read job with Read permission by providing job id" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] }, 
            "model": { "mongoose": "@ts.app/core/models/job" },
            "permission": "Read"
        },
        "createJob":{
            "info": [ "Allows user to create new job with Write permission" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] },
            "model": { "mongoose": "@ts.app/core/models/job" },
            "permission": "Write"
        },
        "updateJob": {
            "info": [ "Allows user to update job with Update permission" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] },
            "model": { "mongoose": "@ts.app/core/models/job" },
            "permission": "Update"
        },
        "deleteJob": {
            "info": [ "Allows user to delete job with Delete permission" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] },
            "model": { "mongoose": "@ts.app/core/models/job" },
            "permission": "Delete"
        }
    },
    "MessagingCampaign": {
        "createMessagingCampaignJob": {
            "info": [ "Allows user to create new MessagingCampaign job via EXPRESS API" ],
            "auth": { "tokens": ["Bearer", "Cookie", "ApiKey"] },
            "permission": "Write"
        }
    }
}