#
# Assumptions:
# 

exploderpm:
	rpm2cpio build/distributions/mon-ui-0.0.1-1.x86_64.rpm |cpio -idmv

gclean:
	gradle clean

gcreaterpm:
	gradle createRpm

grelease:
	gradle release

dblddebug:
	docker build --rm --target release --build-arg MON_VERSION=0.0.1 -t localhost:5000/options/mon-ng/mon-ui:latest -f Dockerfile docker --no-cache

dbldrelease:
	docker build --rm --target release --build-arg MON_VERSION=0.0.1 -t localhost:5000/options/mon-ng/mon-ui:latest -f Dockerfile docker

dblduib:
	docker build --rm --target buildui -t localhost:5000/options/mon-ng/mon-ui-builder:latest -f Dockerfile.buildui .

dbldui:
	docker run --entrypoint="/bin/bash" -v $(PWD):/host -it localhost:5000/options/mon-ng/mon-ui-builder:latest  -c "gradle --stacktrace  clean createRpm && ls -ltra /work/build/distributions && cp /work/build/distributions/mon-ui* /host/"

dbldui2:
	docker run --entrypoint="/bin/bash" -v $(PWD):/host -it localhost:5000/options/mon-ng/mon-ui-builder:latest  -c "gradle -Dhttp.proxyHost=localhost -Dhttp.proxyPort=3128 -Dhttp.nonProxyHosts='docker,localhost,127.0.0.1,localaddress,*localdomain.com,localdomain.com,*foo.com' && cp /work/build/distributions/mon-ui* /host/"

dbldui3:
	docker run --entrypoint="/bin/bash" -v $(PWD):/host -it localhost:5000/options/mon-ng/mon-ui-builder:latest  -c "gradle -Dhttp.proxyHost=localhost -Dhttp.proxyPort=3128 -Dhttp.nonProxyHosts='docker,localhost,127.0.0.1,localaddress,*localdomain.com,localdomain.com,*foo.com' && cp /work/build/distributions/mon-ui* /host/"

dpushremote:
	docker push localhost:5000/options/mon-ng/mon-ui:latest

dlogin:
	docker login localhost:5000

drun:
	docker run --name monui -dit  -p 80:80 --net=mon-ng poc/nginx:latest

drun1:
	docker run --name monui -dit  -p 80:80  --net=monitoring poc/nginx:latest

drun2:
	docker run --name monui -dit  -p 80:80  --net=host poc/nginx:latest

dkrbash:
	docker exec -it monui /bin/bash

dtaglocal:
	docker tag localhost:5000/options/mon-ng/mon-ui:latest localhost:5000/options/mon-ng/mon-ui:latest

dpushlocal:
	docker push localhost:5000/options/mon-ng/mon-ui:latest
