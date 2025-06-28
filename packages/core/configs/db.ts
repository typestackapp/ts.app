import { DBConnectionInput } from "@ts.app/core/common/db.js";
import { mongo } from "@ts.app/core/configs/env.js";

export default {
    "mongoose": {
        "core": {
            "conn": {
                "host": `mongodb://${mongo.try?.MONGO_HOST || 'core.mongo:27017'}/${mongo.try?.MONGO_DB_NAME || 'tsapp'}`,
                "options": {
                    "auth": {
                        "username": mongo.try?.MONGO_USERNAME || 'root',
                        "password": mongo.try?.MONGO_PASSWORD || 'root-psw'
                    },
                    "authSource": "admin",
                    "replicaSet": mongo.try?.MONGO_DB_NAME || 'tsapp',
                }
            }
        }
    }
} satisfies DBConnectionInput