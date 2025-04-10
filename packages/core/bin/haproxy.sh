#!/bin/sh
echo "--------------------------------------"
echo "---------------PROXY------------------"
echo "--------------------------------------"

SERVER=${TS_DOMAIN_NAME}

while true; do
    PID=$(pidof haproxy)

    if [ -n "$PID" ]; then
        echo "Reloading HAProxy with PID $PID"
        haproxy -f /usr/local/etc/haproxy/haproxy.cfg -sf $PID | tee -a /var/log/proxy.log
    else
        echo "Starting HAProxy (no running process found)"
        haproxy -f /usr/local/etc/haproxy/haproxy.cfg | tee -a /var/log/proxy.log
    fi

    sleep $CERTBOT_RESTART_TIME
done