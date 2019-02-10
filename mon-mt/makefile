# launch monitoring in-place (no-jar)
gbootrun:
	gradle bootRun

gclean:
	gradle clean

# create executable jar
gbootrepackage:
	gradle bootRepackage

gcreaterpm:
	gradle bootRepackage createRpm

stagenewrpm:
	cp build/distributions/*.rpm docker/

run:
	java -jar ./build/libs/mon-app-0.0.1.jar

dbldrelease:
	docker build  --build-arg MON_VERSION=0.0.1 --target release --rm -t localhost:5000/options/mon-ng/mon-mt:latest -f Dockerfile docker

dblddebug:
	docker build  --build-arg MON_VERSION=0.0.1 --target debug --rm -t localhost:5000/options/mon-ng/mon-mt:latest -f Dockerfile docker

dpushremote:
	docker push localhost:5000/options/mon-ng/mon-mt:latest 

drun:
	docker run --name monmt -e MON_VERSION=0.0.1 -e JAVA_OPTS='-Xmx2gi -Xms2g -XX:PermSize=1024m -XX:MaxPermSize=1024m' -dit -p 8080:8080 --net=mon-ng poc/mon-app:latest

drunmyb:
	docker run --name monmt --net=monitoring -e MON_VERSION=0.0.1 -dit -p 8080:8080 poc/mon-app:latest

drun2host:
	docker run --name monmt --net=host -e MON_VERSION=0.0.1 -dit -p 8080:8080 poc/mon-app:latest

dbash:
	docker exec -it monmt /bin/bash

dpushlocal:
	docker push localhost:5000/options/mon-ng/mon-mt:latest
