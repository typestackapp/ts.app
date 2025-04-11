#!/bin/sh
echo "--------------------------------------"
echo "---------------PROXY------------------"
echo "--------------------------------------"

SERVER=${TS_DOMAIN_NAME}

while true; do
    # use haproxy graceful reload to avoid downtime
    # get latest haproxy master process, NOTE: order of pidof output is not guaranteed so this could cause problems
    PID=$(set -- $(pidof haproxy); echo $1)

    if [ -n "$PID" ]; then
        echo "Reloading HAProxy with PID $PID"
        haproxy -f /usr/local/etc/haproxy/haproxy.cfg -D -sf $PID >> /var/log/proxy.log 2>&1
    else
        echo "Starting HAProxy (no running process found)"
        haproxy -f /usr/local/etc/haproxy/haproxy.cfg -D >> /var/log/proxy.log 2>&1
    fi

    sleep $CERTBOT_RESTART_TIME
done
