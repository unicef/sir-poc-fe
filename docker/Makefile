CMD?=
TARGET?=not_set
DOCKER_IMAGE=unicef/sir-fe
DOCKERFILE?=Dockerfile
BUILD_OPTIONS?=--squash --rm


help:
	echo ""


clean:
	-docker rmi ${DOCKER_IMAGE}:${TARGET}

build:
	docker build ${BUILD_OPTIONS} \
			--build-arg GITHUB_TOKEN=${GITHUB_TOKEN} \
			--build-arg VERSION=${TARGET} \
			-t ${DOCKER_IMAGE}:${TARGET} \
			-f Dockerfile .

run:
	docker run -p 8000:8081 --rm \
			-it ${DOCKER_IMAGE}:${TARGET} \
			${CMD}

push:
	docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
	docker tag ${DOCKER_IMAGE}:${TARGET} ${DOCKER_IMAGE}:${TARGET}
	docker tag ${DOCKER_IMAGE}:${TARGET} ${DOCKER_IMAGE}:latest
	docker push ${DOCKER_IMAGE}:${TARGET}
	docker push ${DOCKER_IMAGE}:latest


test:
#	CMD="\"sh -c \'python -c \\\"import sir\'\\\"\"" $(MAKE) run
	CMD='polymer lint' $(MAKE) run

shell:
#	CMD="\"sh -c \'python -c \\\"import sir\'\\\"\"" $(MAKE) run
	CMD='/bin/sh' $(MAKE) run
