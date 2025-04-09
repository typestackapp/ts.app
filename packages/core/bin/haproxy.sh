#!/bin/sh
echo "--------------------------------------"
echo "---------------PROXY------------------"
echo "--------------------------------------"

SERVER=${TS_DOMAIN_NAME}

# RENEW CERTS
while true
do
    haproxy -f /usr/local/etc/haproxy/haproxy.cfg | tee -a /var/log/proxy.log &
    sleep $CERTBOT_RESTART_TIME 
done