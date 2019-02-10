# __BASE________________________________
FROM centos:7 AS base

ARG MON_VERSION

COPY nginx.repo /etc/yum.repos.d/nginx.repo

# Normally, we'd pull from a repo.
# This hack assumes rpm is staged in docker build context.
# And why an rpm?
COPY mon-ui-${MON_VERSION}.x86_64.rpm /tmp/mon-ui-${MON_VERSION}.x86_64.rpm
COPY wait-for-it.sh /wait-for-it.sh
COPY entrypoint.sh /entrypoint.sh

RUN yum -y install nginx && \
  yum -y install which && \
  yum clean all && \
  rpm -ivh /tmp/mon-ui-${MON_VERSION}.x86_64.rpm && \
  rm -rf /tmp/mon-ui-${MON_VERSION}.x86_64.rpm && \
  mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig && \
  mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.orig

COPY nginx.conf /etc/nginx/

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx"]

# __RELEASE________________________________
FROM base AS release

# __DEPENDENCIES________________________________
FROM base AS dependencies

RUN yum -y install epel-release && \
  yum -y install nc && \
  yum -d 0 -e 0 -y install net-tools && \
  yum clean all


# __DEBUG________________________________
FROM dependencies AS debug


