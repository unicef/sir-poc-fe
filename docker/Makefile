CMD?=
TARGET?=dev
DOCKER_IMAGE=unicef/sir-fe
DOCKERFILE?=Dockerfile
BUILD_OPTIONS?=--squash --rm
GITHUB_TOKEN?=
DEVELOP?=

help:
	@echo "${GITHUB_TOKEN}"
	@echo "${TARGET}"


clean:
	-docker rmi ${DOCKER_IMAGE}:${TARGET}

build:
	cd .. && docker build ${BUILD_OPTIONS} \
			--build-arg GITHUB_TOKEN=${GITHUB_TOKEN} \
			--build-arg DEVELOP=${DEVELOP} \
			--build-arg VERSION=${TARGET} \
			--build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
			-t ${DOCKER_IMAGE}:${TARGET} \
			-f docker/Dockerfile .
	@docker images | grep ${DOCKER_IMAGE}
	@docker inspect --format "{{ index .Config.Labels}}" ${DOCKER_IMAGE}:${TARGET}

run:
	docker run -p 8000:8081 --rm \
			-it ${DOCKER_IMAGE}:${TARGET} \
			${CMD}

test:
	CMD='polymer lint' $(MAKE) run

shell:
	CMD='/bin/sh' $(MAKE) run

push:
	docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
	docker tag ${DOCKER_IMAGE}:${TARGET} ${DOCKER_IMAGE}:${TARGET}
	docker tag ${DOCKER_IMAGE}:${TARGET} ${DOCKER_IMAGE}:latest
	docker push ${DOCKER_IMAGE}:${TARGET}
	docker push ${DOCKER_IMAGE}:latest

