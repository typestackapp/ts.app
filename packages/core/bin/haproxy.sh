#!/bin/sh
echo "--------------------------------------"
echo "--------------HAPROXY-----------------"
echo "--------------------------------------"

FULLCHAIN="/home/ssl/"${CERTBOT_DOMAIN}"/fullchain.pem"
CONFIG_FILE="/usr/local/etc/haproxy/haproxy.cfg"
LOG_FILE="/var/log/proxy.log"

while true; do
    # Check if the fullchain file exists
    if [ ! -f "$FULLCHAIN" ]; then
        echo "[HAPROXY] ERROR: Fullchain file $FULLCHAIN does not exist."
        # Sleep before retrying
        sleep 5 
        continue
    fi

    # Validate FULLCHAIN certificate
    if ! openssl x509 -in "$FULLCHAIN" -noout -text > /dev/null 2>&1; then
        echo "[HAPROXY] ERROR: Fullchain file $FULLCHAIN is not a valid certificate."
        # Sleep before retrying
        sleep 5 
        continue
    fi

    # Validate configuration
    haproxy -c -f "$CONFIG_FILE"
    if [ $? -ne 0 ]; then
        echo "[HAPROXY] ERROR Configuration file is invalid."

        # Sleep before retrying
        sleep 15 
        continue
    fi

    # Get current HAProxy master PID
    PID=$(set -- $(pidof haproxy); echo $1)

    if [ -n "$PID" ]; then
        echo "[HAPROXY] INFO: Reloading HAProxy with PID $PID"
        haproxy -f "$CONFIG_FILE" -D -sf $PID >> "$LOG_FILE" 2>&1
    else
        echo "[HAPROXY] INFO: Starting HAProxy (no running process found)"
        haproxy -f "$CONFIG_FILE" -D >> "$LOG_FILE" 2>&1
    fi

    sleep $CERTBOT_RESTART_TIME
done
