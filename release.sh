docker build . -t biblibra/web:latest
docker push biblibra/web:latest
cd backend
docker build . -t biblibra/api:latest
docker push biblibra/api:latest
