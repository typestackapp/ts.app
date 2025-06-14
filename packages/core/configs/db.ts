import { DBConnectionInput } from "@ts.app/core/common/db.js";
import { mongo } from "@ts.app/core/configs/env.js";

export default {
    "mongoose": {
        "core": {
            "conn": {
                "host": `mongodb://${mongo.get?.MONGO_HOST || 'core.mongo:27017'}/${mongo.get?.MONGO_DB_NAME || 'tsapp'}`,
                "options": {
                    "auth": {
                        "username": mongo.get?.MONGO_USERNAME || 'root',
                        "password": mongo.get?.MONGO_PASSWORD || 'root-psw'
                    },
                    "authSource": "admin",
                    "replicaSet": mongo.get?.MONGO_DB_NAME || 'tsapp',
                }
            }
        }
    }
} satisfies DBConnectionInput