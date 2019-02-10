#!/bin/bash

echo "Starting app..."

#java "sh", "-c", "java -jar ${IRIS_PATH}/mon-app-${IRIS_VERSION}.jar"

#JAVA_OPTS='-Xmx2gi -Xms2g -XX:PermSize=1024m -XX:MaxPermSize=1024m'

#"sh", "-c", "java -jar ${IRIS_PATH}/mon-app-${IRIS_VERSION}.jar"

HOSTIP=$(ping -c 1 `hostname`|awk '/PING/ {print $3}'|tr -d '()')

#sed -i "s/<host-ip>/${HOSTIP}/" /apps/grudkowm/dash-mon/config/application.yml
sed -i "s/<host-ip>/127.0.0.1/" /apps/grudkowm/dash-mon/config/application.yml

printf "mon-mt entrypoint [hostip=%s]" ${HOSTIP} 

ls -ltra /apps/grudkowm/dash-mon

ping -c 1 ${HOSTIP}

exec "$@"

