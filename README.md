# deploy to Docker hub
docker build -t hook-line-notify .
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t kekla/hook-line-notify:latest --push .
