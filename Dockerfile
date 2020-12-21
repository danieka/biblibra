FROM node:15-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install -g vite
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
RUN apk --update add gcc libc-dev libstdc++6 && \
    # install glibc for hasura-cli
    # https://github.com/hasura/graphql-engine/issues/4105#issuecomment-609639030
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.32-r0/glibc-2.32-r0.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.32-r0/glibc-bin-2.32-r0.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.32-r0/glibc-i18n-2.32-r0.apk && \
    apk add glibc-2.32-r0.apk && \
    # handle glibc trigger error
    # https://github.com/sgerrand/alpine-pkg-glibc/issues/119#issuecomment-626627458
    rm -f /usr/glibc-compat/lib/ld-linux-x86-64.so.2 && \
    ln -s /usr/glibc-compat/lib/ld-2.32.so /usr/glibc-compat/lib/ld-linux-x86-64.so.2 && \
    apk add glibc-bin-2.32-r0.apk glibc-i18n-2.32-r0.apk && \
    /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8 

COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | sh
EXPOSE 80
WORKDIR /app
COPY ./hasura/ /app
COPY ./docker-entrypoint.sh /app

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
