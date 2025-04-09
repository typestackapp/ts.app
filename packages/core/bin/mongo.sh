#!/bin/bash
MONGO_INITDB_CONFIG_FILE=/configs/mongo/init.conf

check_mongodb_rs() {
    if mongosh --host localhost --port 27017 --eval "rs.status()" >/dev/null 2>&1; then
        echo "MongoDB replication set is accessible without authentication."
    else
        # Authentication is required
        read -p "Username: " username
        read -s -p "Password: " password
        echo
        if mongosh --host localhost --port 27017 --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --eval "rs.status()" >/dev/null 2>&1; then
            echo "MongoDB replication set is accessible with provided authentication."
        else
            echo "Failed to access MongoDB replication set even with provided authentication. Exiting..."
            exit 1
        fi
    fi
}

check_mongodb_ping() {
    mongosh --host localhost --port 27017 --eval "db.adminCommand('ping')" >/dev/null 2>&1
}

# Await MongoDB replication set status
await_mongodb_rs() {
    retry_count=0
    max_retries=100
    retry_delay=2
    while ! check_mongodb_rs; do
        if [ $retry_count -lt $max_retries ]; then
            echo "MongoDB replication set not ready, retrying in $retry_delay seconds..."
            sleep $retry_delay
            ((retry_count++))
        else
            echo "Max retries reached for MongoDB replication set. Exiting..."
            exit 1
        fi
    done
}

# Await MongoDB ping
await_mongodb_ping() {
    retry_count=0
    max_retries=100
    retry_delay=2
    while ! check_mongodb_ping; do
        if [ $retry_count -lt $max_retries ]; then
            echo "MongoDB not ready, retrying in $retry_delay seconds..."
            sleep $retry_delay
            ((retry_count++))
        else
            echo "Max retries reached for MongoDB ping. Exiting..."
            exit 1
        fi
    done
}

# create keyfile if not exists
if [ ! -f "$MONGO_KEY_PATH" ]; then
    echo "Creating keyfile..."
    openssl rand -base64 756 > $MONGO_KEY_PATH
fi

chmod 400 $MONGO_KEY_PATH

# start mongo
mongod --bind_ip $MONGO_BIND_IP --keyFile $MONGO_KEY_PATH --dbpath $MONGO_DB_PATH --quiet --logpath /dev/null --setParameter logLevel=0 --replSet tsapp &

await_mongodb_ping

echo "--------initiate replica set--------"
mongosh --host localhost --port 27017 --eval "
rs.initiate({
    _id: 'tsapp',
    members: [
        { _id: 0, host: 'mongo:27017' } 
    ],
});
"

await_mongodb_ping
await_mongodb_rs

echo "--------create root user--------"
mongosh --host localhost --port 27017 --eval "
admin = db.getSiblingDB('admin');
admin.createUser({
    user: '$MONGO_INITDB_ROOT_USERNAME', 
    pwd: '$MONGO_INITDB_ROOT_PASSWORD', 
    roles: [{role: 'root', db: 'admin'}]
});
"

# if $MONGO_INITDB_NAME is not empty
if [ ! -z "$MONGO_INITDB_NAME" ]; then
    echo "--------create db with name $MONGO_INITDB_NAME--------"
    mongosh --host localhost --port 27017 -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --eval "
        db = db.getSiblingDB('$MONGO_INITDB_NAME');
        db.createCollection('configs');
    "
fi

# selep forever
sleep infinity