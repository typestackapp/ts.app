#!/bin/sh
cd /tsapp;
npm install;
cd ${TS_ENTRY_POINT};
ts service --up --env=${TS_ENV_TYPE};
pm2 logs;