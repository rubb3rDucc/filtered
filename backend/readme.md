# Filtered Backend (Server and Database)

## Start 'ere

- install packages and start the backend server and db: 
<code>
    npm i
    npm start
</code>

- db build script: `tba`

## docker stuff (for me)

### build docker-compose files (container and volumes)

- pull postgres 16 image for the db: 
`docker pull postgres:16`

- build docker files: 
`docker-compose up --build`

- remove all docker containers, networks, volumes: `docker-compose down -v`

- look at all currently running containers: `docker container ls`

- checking the IP for the db container: `docker inspect ${containerId} --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'` 

- other remove docker all containers and volumes: 
`docker rm -vf $(docker ps -aq) && docker system prune`