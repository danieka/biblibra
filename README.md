# Installation

It takes about a minute or so for all services to start. The docker environment will expose port 8081 for the web app and 8082 for Hasura GraphQL engine.

You need to set up a reverse proxy, such as Nginx in front of the docker environment. The web app should be exposed on 443 and Hasura should be exposed on 8080.

```
curl https://raw.githubusercontent.com/danieka/biblibra/main/docker-compose.prod.yml > docker-compose.yml
sed -i "s/myadminsecretkey/$(openssl rand -base64 32)/g" docker-compose.yml
docker-compose up -d
```

Your nginx config might look something like this:

```
server {
	root /var/www/html;
	index index.html index.htm index.nginx-debian.html;

	server_name $HOSTNAME;

	location / {
	    proxy_pass http://localhost:8081/;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/$HOSTNAME/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$HOSTNAME/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
	listen 8080 ssl;
    listen [::]:8080 ssl;

    ssl_certificate /etc/letsencrypt/live/$HOSTNAME/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$HOSTNAME/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

	server_name $HOSTNAME;

	location / {
		proxy_pass http://localhost:8082/;
        }
}

server {
    if ($host = $HOSTNAME) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


	listen 80;
	listen [::]:80;

	server_name $HOSTNAME;
    return 404; # managed by Certbot


}
```
