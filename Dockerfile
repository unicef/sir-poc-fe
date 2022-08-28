# Dev stage.
FROM node:8.17-alpine AS dev

ENV UV_THREADPOOL_SIZE=64

RUN apk add --no-cache --upgrade \
    bash \
    # Explicitly specified due to CVE
    'openssl>=1.1.1i-r0' \
    'libxml2>=2.9.10-r5' \
    'freetype>=2.10.1-r1'

WORKDIR /code

ADD package.json package-lock.json /code/

RUN npm install -g --unsafe-perm gulp bower polymer-cli && npm install

COPY . .

EXPOSE 8080

CMD ["polymer", "serve", "--npm", "--verbose", "-H", "0.0.0.0", "-p", "8080"]

# Dist builder stage
FROM dev AS dist-builder

ENV DEVELOP=1

RUN npm run build

# Dist stage.
FROM nginx:1.23.1-alpine AS dist

RUN apk add --no-cache --upgrade \
    bash \
    # Explicitly specified due to CVE-2020-24977
    'openssl>=1.1.1i-r0' \
    'libxml2>=2.9.10-r5' \
    'freetype>=2.10.4-r0'

WORKDIR /code

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=dist-builder --chown=root:root /code/build/es6-bundled/ ./

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
