FROM node:8-alpine
RUN apk update

ARG VERSION
ARG GITHUB_TOKEN

ENV VERSION $VERSION
ENV GITHUB_TOKEN $GITHUB_TOKEN


RUN apk add --update bash curl git
WORKDIR /code


RUN curl -s -L -u "${GITHUB_TOKEN}:" "https://github.com/unicef/sir-poc-fe/archive/${VERSION}.tar.gz" | tar -xzf - --strip-components=1 \
    && npm install polymer-cli \
    && npm install \
    && npm run build

ENV PATH="/code/node_modules/.bin:${PATH}"

CMD ["polymer", "serve", "-H", "0.0.0.0"]
