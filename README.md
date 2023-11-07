# BLOG AS A SERVICE SERVER
Use as AWS EC2 instance and handle auth (POST) through aws gateway and also cors

Docker mongoDB:
```
docker run --name mongodb -p 27017:27017 -it -d mongo:latest
```

docker build -t baas .
docker run -it -p 3000:3000 -e PORT=3000 -e ENVIRONMENT=production --name baas-container baas

## Maintainers
This project was built and maintained by Håkan Sundström.
https://github.com/Sundarenius
