#!/bin/sh
echo "--------------------------------------"
echo "--------------CERTBOT-----------------"
echo "--------------------------------------"

EMAIL="-m ${CERTBOT_EMAIL}"
SERVER=${CERTBOT_DOMAIN}

CERTBOT_FLAGS=${CERTBOT_FLAGS:-""}
CERTBOT_INIT=${CERTBOT_INIT:-"false"}
CERTBOT_SELFSIGNED=${CERTBOT_SELFSIGNED:-"false"}

# Certbot certificates paths
# cert.pem: Just your server’s certificate (The “leaf” certificate. For example.com, issued by Let's Encrypt.)
# chain.pem: Just the CA/intermediate certificates (The chain from Let's Encrypt's intermediate to their root.)
# fullchain.pem: Concatenation of cert.pem + chain.pem (What most servers want as the “public certificate.”)
# privkey.pem: Your private key (Never share this one!)
CERTBOT_ROOT="/etc/letsencrypt/live/${SERVER}"
KEY_SOURCE="${CERTBOT_ROOT}/privkey.pem"
CHAIN_SOURCE="${CERTBOT_ROOT}/fullchain.pem"
CERT_SOURCE="${CERTBOT_ROOT}/cert.pem"

# Certificate output paths
CERT_ROOT="/home/ssl/${SERVER}"
KEY_DST="${CERT_ROOT}/privkey.pem"
CHAIN_DST="${CERT_ROOT}/fullchain.pem"
CERT_DST="${CERT_ROOT}/cert.pem"

# if CERTBOT_EXTRA_DOMAIN_NAMES = string: "undefined" or "" then set to empty string
EXTRA_DOMAIN_NAMES=${CERTBOT_EXTRA_DOMAIN_NAMES:-""}
if [ "${EXTRA_DOMAIN_NAMES}" = "undefined" ]; then
    EXTRA_DOMAIN_NAMES=""
fi
DOMAINS="-d ${CERTBOT_DOMAIN} ${EXTRA_DOMAIN_NAMES}"

# install nginx and serve well known challenge in background
apk add nginx

echo "--------------------------------------"
echo "CERTBOT_INIT="$CERTBOT_INIT
echo "CERTBOT_SELFSIGNED="$CERTBOT_SELFSIGNED
echo "CERTBOT_FLAGS="$CERTBOT_FLAGS
echo "DOMAINS="$DOMAINS
echo "EMAIL="$EMAIL
echo "--------------------------------------"

# make needed dirs and files
mkdir -p /etc/nginx/logs

if [ ! -f /etc/nginx/logs/certbot.error.log ]; then
    touch /etc/nginx/logs/certbot.error.log
fi

if [ ! -f /etc/nginx/logs/certbot.access.log ]; then
    touch /etc/nginx/logs/certbot.access.log
fi

# RENEW CERTBOT CERTS
while true
do  
    # create cert folder if not exist
    if [ ! -d "${CERT_ROOT}" ]; then
        mkdir -p "$CERT_ROOT"
    fi

    # create self signed certificate
    if [ "${CERTBOT_SELFSIGNED}" = "true" ]; then
        # check if certs are expired
        if openssl x509 -checkend 86400 -noout -in ${CHAIN_DST}; then
            echo "Certificate will not expire - Using existing self signed certificate SERVER=$SERVER"
        else
            echo "generating new certs, certs are expired or not found"
            # remove old certs if exist
            if [ -f "${CHAIN_DST}" ]; then
                rm ${CHAIN_DST}
            fi
            if [ -f "${KEY_DST}" ]; then
                rm ${KEY_DST}
            fi
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${KEY_DST} -out ${CERT_DST} -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=${SERVER}"

            # combine cert and key into fullchain
            cat ${CERT_DST} ${KEY_DST} > ${CHAIN_DST}
        fi
    fi

    # renew or init certs with certbot
    if [ "${CERTBOT_SELFSIGNED}" = "false" ]; then
    
        # check if certs exists if not set CERTBOT_INIT to true
        if [ ! -f "${CHAIN_DST}" ]; then
            echo "certs not found, setting CERTBOT_INIT to true"
            CERTBOT_INIT="true"
        fi

        # check if chain files exist otherwise set CERTBOT_INIT to true
        if [ ! -f ${CHAIN_SOURCE} ]; then
            echo "chain file not found, setting CERTBOT_INIT to true"
            CERTBOT_INIT="true"
        fi

        # check if key file exists otherwise set CERTBOT_INIT to true
        if [ ! -f ${KEY_SOURCE} ]; then
            echo "key file not found, setting CERTBOT_INIT to true"
            CERTBOT_INIT="true"
        fi

        # Get currently issued domains from cert
        EXISTING_DOMAINS=""
        if [ -f ${CHAIN_SOURCE} ]; then
            EXISTING_DOMAINS=$(openssl x509 -in ${CHAIN_SOURCE} -noout -text \
                | grep DNS: \
                | sed 's/DNS://g' \
                | tr -d ' ' \
                | tr ',' '\n' \
                | grep -v '^$' \
                | sort \
                | uniq)

            REQUESTED_DOMAINS=$(echo "${CERTBOT_DOMAIN} ${CERTBOT_EXTRA_DOMAIN_NAMES}" \
                | tr ' ' '\n' \
                | sed 's/^-d//' \
                | grep -v '^$' \
                | sort \
                | uniq)

            if ! diff -q <(echo "${EXISTING_DOMAINS}") <(echo "${REQUESTED_DOMAINS}") > /dev/null; then
                echo "Domain list changed diff:"
                diff <(echo "${EXISTING_DOMAINS}") <(echo "${REQUESTED_DOMAINS}")
                CERTBOT_INIT="true"
            else
                echo "Domain list unchanged. No need to force renewal."
            fi
        fi

        # start nginx
        echo "starting nginx"
        nginx

        # initialize certbot on first run
        if [ "${CERTBOT_INIT}" = "true" ]; then
            echo "initializing certbot - certbot certonly $CERTBOT_FLAGS --webroot --debug-challenges --webroot-path /var/www/wk/ $DOMAINS $EMAIL --agree-tos --force-renewal --non-interactive"
            eval "certbot certonly $CERTBOT_FLAGS --webroot --debug-challenges --webroot-path /var/www/wk/ $DOMAINS $EMAIL --agree-tos --force-renewal --non-interactive"
        fi

        # renew certs
        eval "certbot renew"

        # stop nginx
        echo "stopping nginx"
        nginx -s stop || true

        # install certs
        eval "install -c -m 644 ${KEY_SOURCE} ${KEY_DST}"
        eval "install -c -m 644 ${CERT_SOURCE} ${CERT_DST}"
        cat ${CHAIN_SOURCE} ${KEY_SOURCE} | install -m 644 /dev/stdin ${CHAIN_DST}
    fi

    # check if certs are valid
    openssl x509 -in ${CHAIN_DST} -noout -subject
    openssl rsa -in ${KEY_DST} -check -noout

    sleep $CERTBOT_RESTART_TIME 
done