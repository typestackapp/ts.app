import { DBConnectionInput } from "@ts.app/core/common/db";

export default {
    "mongoose": {
        "core": {
            "conn": {
                "host": "mongodb://mongo:27017/tsapp",
                "options": {
                    "auth": {
                        "username": "root",
                        "password": "root-psw"
                    },
                    "authSource": "admin",
                    "replicaSet": "tsapp"
                }
            }
        }
    }
} satisfies DBConnectionInput