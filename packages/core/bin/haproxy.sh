#!/bin/sh
echo "[START] started haproxy at: $(date)"

FULLCHAIN="/home/ssl/"${CERTBOT_DOMAIN}"/fullchain.pem"
CONFIG_FILE="/usr/local/etc/haproxy/haproxy.cfg"

while true; do
    # Check if the fullchain file exists
    if [ ! -f "$FULLCHAIN" ]; then
        echo "[ERROR] Fullchain file $FULLCHAIN does not exist."
        # Sleep before retrying
        sleep 5 
        continue
    fi

    # Validate FULLCHAIN certificate
    if ! openssl x509 -in "$FULLCHAIN" -noout -text > /dev/null 2>&1; then
        echo "[ERROR] Fullchain file $FULLCHAIN is not a valid certificate."
        # Sleep before retrying
        sleep 5 
        continue
    fi

    # Validate configuration
    haproxy -c -f "$CONFIG_FILE"
    if [ $? -ne 0 ]; then
        echo "[ERROR] Configuration file is invalid."

        # Sleep before retrying
        sleep 15 
        continue
    fi

    # Get current HAProxy master PID
    PID=$(set -- $(pidof haproxy); echo $1)

    if [ -n "$PID" ]; then
        echo "[INFO] Reloading HAProxy with PID $PID at $(date)"
        haproxy -f "$CONFIG_FILE" -sf $PID
    else
        echo "[INFO] Starting HAProxy (no running process found) at $(date)"
        haproxy -f "$CONFIG_FILE"
    fi

    sleep $CERTBOT_RESTART_TIME
done
