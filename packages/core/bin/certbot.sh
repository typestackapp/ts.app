#!/bin/sh
echo "--------------------------------------"
echo "--------------CERTBOT-----------------"
echo "--------------------------------------"

CERTBOT_INIT=${CERTBOT_INIT:-"true"}
EMAIL="-m ${CERTBOT_EMAIL}"
SERVER=${TS_DOMAIN_NAME}
CERTBOT_SELFSIGNED=${CERTBOT_SELFSIGNED:-"false"}
CHAIN="/etc/letsencrypt/live/${SERVER}/fullchain.pem /home/ssl/${SERVER}/fullchain.pem"
KEY="/etc/letsencrypt/live/${SERVER}/privkey.pem /home/ssl/${SERVER}/privkey.pem"

# if CERTBOT_EXTRA_DOMAIN_NAMES = string: "undefined" or "" then set to empty string
EXTRA_DOMAIN_NAMES=${CERTBOT_EXTRA_DOMAIN_NAMES:-""}
if [ "$EXTRA_DOMAIN_NAMES" = "undefined" ]; then
    EXTRA_DOMAIN_NAMES=""
fi
DOMAINS="-d ${TS_DOMAIN_NAME} ${EXTRA_DOMAIN_NAMES}"

# install nginx and serve well known challenge in background
apk add nginx
nginx -g 'pid /tmp/nginx.pid; daemon off;' &

echo "--------------------------------------"
echo "CERTBOT_INIT="$CERTBOT_INIT
echo "CERTBOT_SELFSIGNED="$CERTBOT_SELFSIGNED
echo "SERVER="$SERVER
echo "DOMAINS="$DOMAINS
echo "EMAIL="$EMAIL
echo "--------------------------------------"

# prevents container from stopping while nginx is running
trap exit TERM

# RENEW CERTBOT CERTS
while true
do  
    # initialize certbot on first run
    if [ "$CERTBOT_INIT" = "true" ]; then
        INIT="true"
        echo "initializing certbot"
        eval "certbot certonly --webroot --debug-challenges --webroot-path /var/www/wk/ ${DOMAINS} ${EMAIL} --agree-tos --force-renewal --non-interactive"
    fi

    # renew certs with certbot
    if [ "$CERTBOT_SELFSIGNED" = "false" ]; then
        eval "certbot renew"
        eval "install -c -m 777 ${CHAIN}"
        eval "install -c -m 777 ${KEY}"
    fi

    # create folder for self signed certs
    if [ ! -d /home/ssl/${SERVER} ]; then
        mkdir -p /home/ssl/${SERVER}
    fi

    # create self signed certificate
    if [ "$CERTBOT_SELFSIGNED" = "true" ]; then
        # check if certs are expired
        if openssl x509 -checkend 86400 -noout -in /home/ssl/${SERVER}/fullchain.pem; then
            echo "Certificate will not expire - Using existing self signed certificate SERVER=$SERVER"
        else
            echo "generating new certs, certs are expired or not found"
            # remove old certs if exist
            if [ -f /home/ssl/${SERVER}/fullchain.pem ]; then
                rm /home/ssl/${SERVER}/fullchain.pem
            fi
            if [ -f /home/ssl/${SERVER}/privkey.pem ]; then
                rm /home/ssl/${SERVER}/privkey.pem
            fi
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /home/ssl/${SERVER}/privkey.pem -out /home/ssl/${SERVER}/fullchain.pem -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=${SERVER}"
        fi
    fi

    # if cert.pem file exists remove it
    if [ -f /home/ssl/${SERVER}/cert.pem ]; then
        rm /home/ssl/${SERVER}/cert.pem
    fi

    # combine fullchain and privkey into cert.pem
    cat /home/ssl/${SERVER}/fullchain.pem /home/ssl/${SERVER}/privkey.pem > /home/ssl/${SERVER}/cert.pem

    sleep $CERTBOT_RESTART_TIME 
done