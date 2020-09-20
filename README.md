# test-babel-node
Deploy nodejs to heroku with Babel to support ES6+

# Docs
1. Docker official: https://docs.docker.com/get-started/part2/#sample-dockerfile
2. Docker cheat sheet: https://devhints.io/docker
3. Docker-compose cheat sheet: https://devhints.io/docker-compose

# How to run
1. Build nodejs app image `docker build -t xxx/nodeapp:1.0 .`
2. Run image as a container: `docker container run -p 3000:3033 --name helloworld -d xxx/nodeapp:1.0`
3. Pass environment variable “name” with the -e option: `docker container run -p 3001:3033 --name customized -e "name=kazan" -d xxx/nodeapp:1.0`
4. Build nginx image: `docker build -t xxx/nginxbalancer:1.0 .`
5. Start container nginx based on above image: `docker container run -p 3033:80 -d vtdthang/nginxbalancer:1.0`

# Push image to registry
1. `docker image push xxx/swarm_balancer:1.0` with "xxx" is username docker hub


# Deploy Swarm our stack of services with docker stack
1. Deploy `docker stack deploy -c docker-compose.yml swarmnodeapp`