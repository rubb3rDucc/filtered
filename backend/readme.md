# Filtered Backend (Server and Database)

## Start 'ere

## development workflow/commands

- code some stuff
- linting: `npm run prettier`
- more linting: `npm run lint`
- build ts: `npm run build`
- run tests: `npm run test`
- watch and build ts files: `npm run watch`
- run server for dev purposes: `npm run ts-dev`
- run server for prod purposes: `npm run start`

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
