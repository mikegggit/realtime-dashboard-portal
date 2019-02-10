dcreatenetwork:
	docker network create -d bridge mon-ng -d --subnet=172.18.0.0/28

dcleanall:
	docker kill monui;
	docker kill monmt;
	docker rm monui;
	docker rm monmt

dcomposestart:
	docker-compose start

dloginlocal:
	docker login localhost:5000

dpush:
	docker push localhost:5000/options/mon-ng:mon-mt-latest

dstartlocalreg:
	docker run -d -p 5000:5000 --restart=always --name registry registry:2

dstoplocalreg:
	docker container stop registry && docker container rm -v registry

dbldgradle:
	docker build --rm --target gradle -t localhost:5000/options/mon-ng/gradle:latest -f Dockerfile.gradlebase .

k8create-deployement:
#	kubectl apply -f monng-deployment.yaml
	kubectl apply -f monng.yaml

k8delete-deployment:
	kubectl delete deployment monng
#	kubectl delete service monng
	kubectl delete service monui
#	kubectl delete service monmt
	kubectl delete service monng-service

k8list-deployments:
	kubectl get deployment

k8listrepsets:
	kubectl get replicasets

k8listpods:
	kubectl get pods

k8listservices:
	kubectl get services

k8describepod:
	kubectl describe pod

k8bash:
	kubectl exec -it monng-58cf69b45b-9gbjq /bin/bash

