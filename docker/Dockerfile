FROM pstauffer/curl:latest as builder
ARG VERSION
ARG GITHUB_TOKEN
ARG DEVELOP

RUN mkdir /code
WORKDIR /code
ADD . /code

RUN if [ "$DEVELOP" = "1" ]; then \
        echo "$VERSION-develop"; \
    else \
        echo "Download package: https://github.com/unicef/sir-poc-fe/archive/${VERSION}.tar.gz"; \
        curl -s -L -u "${GITHUB_TOKEN}:" "https://github.com/unicef/sir-poc-fe/archive/${VERSION}.tar.gz" | tar -xzf - --strip-components=1; \
    fi
#
# end of builder
#
FROM node:10-alpine
ARG VERSION
ARG BUILD_DATE
ARG COMMIT

LABEL MAINTANER=UNICEF
LABEL Version=$VERSION
LABEL Date=$BUILD_DATE

RUN apk add --update git

WORKDIR /code
COPY --from=builder /code /code

RUN npm install polymer-cli \
    && npm install \
    && npm run build

ENV PATH="/code/node_modules/.bin:${PATH}"

CMD ["npm", "run", "start"]
