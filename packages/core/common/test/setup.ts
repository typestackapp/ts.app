import type { UserDocument } from '@ts.app/core/models/user.js'
import type { EmailConfigDocument } from '@ts.app/core/models/config/email.js'
import type { ChannelConfigDocument } from '@ts.app/core/models/config/channel.js'
import type { TokenDocument } from '@ts.app/core/models/user/token.js'

import { Types } from "mongoose"
import { JobList } from "@ts.app/core/common/job"
import { EmailConfigInput, EmailConfigModel } from "@ts.app/core/models/config/email.js"
import { ChannelConfigInput, ChannelConfigModel } from "@ts.app/core/models/config/channel.js"
import { encodeApiKey, hashApiKey, newApiKeySecret } from "@ts.app/core/models/user/util.js"
import { ApiKeyTokenInput, ApiKeyTokenModel } from "@ts.app/core/models/user/token/apikey.js"
import { system_admin_id, all_access_inputs } from "@ts.app/core/updates/main.js"
import { UserModel } from "@ts.app/core/models/user.js"
import tscore from "@ts.app/core"
import { ConvertToEntryPointWithAlias, TypeStack, TypeStackConfig, TypeStackEntryPoint, TypeStackEntryPointWithAlias } from '@ts.app/core/common/cli/typestack.js'
import fs from "fs-extra"

export const api_key_id = new Types.ObjectId()
export const email_config_id = new Types.ObjectId("62091b669343af312f5f1eee")
export const email_channel_config_id = new Types.ObjectId("63453a61fe9cd72c40188adf")
export const api_key_secret = newApiKeySecret(5)
export const api_key_base64 = encodeApiKey(api_key_id, api_key_secret)

export type Setup<T extends TypeStackEntryPointWithAlias = TypeStackEntryPointWithAlias> = {
    root_user: UserDocument
    email_config: EmailConfigDocument
    email_channel_config: ChannelConfigDocument
    api_key: TokenDocument
    jobs: JobList
    config: TypeStackConfig<T>
}

export async function setup<T extends TypeStackEntryPoint = TypeStackEntryPoint>(): Promise<Setup<ConvertToEntryPointWithAlias<T>>> {
    const core_tsapp_test = {} as Setup
    core_tsapp_test.config = TypeStack.config

    // remove logs at the begining of all tests, setup() runs before each test file!
    if (tscore.config.system.DEV_CLEAN_MESSAGES_LOGS) {
        fs.emptyDirSync(`${process.cwd()}/logs/email`)
        fs.emptyDirSync(`/tsapp/logs/email`)
    }

    // upsert root user
    const _user = await UserModel.findOne({ _id: system_admin_id })
    if(!_user) throw "Root user not found"
    core_tsapp_test.root_user = _user

    const email_input: EmailConfigInput = {
        "log": {enabled: false},
        "created_by": core_tsapp_test.root_user._id,
        "updated_by": core_tsapp_test.root_user._id,
        "title": "Email description - this email is created while running tests.",
        "data": {
            "from": {
                "name": 'Name of email sender',
                "address": 'my@email.com'
            },
            "auth": {
                "host": "smtp.office365.com",
                "port": 587,
                "secure": false,
                "auth": {
                    "user": "my@email.com",
                    "pass": "root-psw"
                }
            }
        }
    }

    core_tsapp_test.email_config = await EmailConfigModel.findOneAndUpdate(
        { _id: email_config_id },
        { _id: email_config_id, ...email_input },
        { upsert: true, new: true }
    )

    const channel_data: ChannelConfigInput = {
        "log": {enabled: false},
        "created_by": core_tsapp_test.root_user._id,
        "updated_by": core_tsapp_test.root_user._id,
        "title": "Channel description - this channel config is created while running tests.",
        "data": {
            "services": ["tsapp"],
            "pack": "@ts.app/core",
            "type": "EmailMessageConsumer",
            "path": "@ts.app/core/consumers/message/email",
            "options": {
                "channel": {
                    "prefetch": {
                        "channel": 1 // prefetch amount per consumer
                    }
                },
                "queue": {
                    "durable": true, // save queue in disk memory
                    "autoDelete": false, // delete queue when all consumers are disconnected
                    "exclusive": false // allow only one connection
                },
                "publish": { // when sending to queue will use these options
                    "persistent": true
                }
            },
            "consumers": [
                {
                    "_id": new Types.ObjectId(),
                    "options": {
                        "consumerTag": email_config_id.toString(),
                        "noAck": false, // don't wait for consumer to confirm message
                    }
                }
            ]
        }
    }

    core_tsapp_test.email_channel_config = await ChannelConfigModel.findOneAndUpdate(
        { _id: email_channel_config_id },
        { _id: email_channel_config_id, ...channel_data },
        { upsert: true, new: true }
    )

    const api_key_data: ApiKeyTokenInput = {
        user_id: core_tsapp_test.root_user._id,
        status: "active",
        data: {
            key: hashApiKey(api_key_secret),
            access: all_access_inputs,
            description: `TEST KEY IS: ApiKey%20${api_key_base64}`
        }
    }

    core_tsapp_test.api_key = await ApiKeyTokenModel.findOneAndUpdate(
        { _id: api_key_id },
        { _id: api_key_id, ...api_key_data },
        { upsert: true, new: true } 
    )

    // adds all active jobs
    core_tsapp_test.jobs = await JobList.getInstance()

    return core_tsapp_test as Setup<ConvertToEntryPointWithAlias<T>>
}