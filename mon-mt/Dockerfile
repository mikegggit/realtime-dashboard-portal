# __BASE________________________________
FROM localhost:5000/nimmis/java-centos:oracle-8-jre AS base

ARG MON_VERSION=0.0.1-1

RUN yum -y install which && \
  yum clean all && \
  rm -rf /var/cache/yum


WORKDIR /tmp
# Normally, we'd pull from a repo.
# This hack assumes rpm is staged in docker build context.
# And why an rpm?
COPY mon-ng-app-${MON_VERSION}.x86_64.rpm .
COPY entrypoint.sh /entrypoint.sh
COPY wait-for-it.sh /wait-for-it.sh
COPY libs /home/libs/

RUN rpm -ivh /tmp/mon-ng-app-${MON_VERSION}.x86_64.rpm && \
  rm -rf /tmp/mon-ng-app-${MON_VERSION}.x86_64.rpm

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
ENV MON_PATH /apps/grudkowm/dash-mon
CMD [ "sh", "-c", "java -jar ${MON_PATH}/mon-ng-app-${MON_VERSION}.jar" ] 
WORKDIR /apps/grudkowm/dash-mon

# __RELEASE________________________________
FROM base AS release

# __DEPENDENCIES________________________________
FROM base AS dependencies

RUN yum -y install unzip && \
  yum -d 0 -e 0 -y install net-tools && \
  yum -y install nc && \
  yum -y install net-tools && \
  yum -y install epel-release && \
  yum -y install iproute && \
  yum -y install traceroute && yum clean all

ENV FOO bar
# __DEBUG________________________________
FROM dependencies AS debug


