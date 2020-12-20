# Installation

It takes about a minute or so for all services to start. The docker environment will expose port 8081 for the web app and 8082 for Hasura GraphQL engine.

You need to set up a reverse proxy, such as Nginx in front of the docker environment. The web app should be exposed on 443 and Hasura should be exposed on 8080.

```
curl https://raw.githubusercontent.com/danieka/biblibra/main/docker-compose.prod.yml > docker-compose.yml
sed -i "s/myadminsecretkey/$(openssl rand -base64 32)/g" docker-compose.yml
docker-compose up -d
```
