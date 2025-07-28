### Prerequisites

- **Docker**: >27.4.0
- **Node.js**: >20.19.1


### Configure and build
```bash
git clone https://github.com/typestackapp/ts.app.git
cd ts.app
npm install
npm run build --workspaces --if-present
npm link ./packages/core
cd ./packages/dev
ts config
```

###  Start docker containers
```bash
docker-compose -f ./appdata/compose/compose.core.yml up -d
```

### Update and restart services
```bash
docker-compose -f ./appdata/compose/compose.core.yml exec core /bin/bash
cd /ts
ts update
pm2 ls
pm2 restart all
pm2 logs
```

### Access admin panel
```
username: test@test.com
password: root-psw
https://localhost:7443/admin
https://10.44.44.41:7443/admin
```

### Express endpoints examples
- [express/ping](packages/dev/express/test_[any_param].ts)

### Graphql modules examples:
- [graphql/common](packages/core/graphql/common)
- [graphql/user](packages/core/graphql/user)
- [graphql/job](packages/core/graphql/job)
    
### Standalone package folder structure:
- bin - docker entrypoint scripts or other .sh scripts
- common - shared code between services, backend and frontend
- components - react components, next.js actions, graphql queries
- configs - 
    - env.ts - zod validated env variables
    - access.ts - access control lists, access scopes
- consumers - rabbitmq conumers
- dist - compiled code (distribution)
- docker - docker templates
- express - REST API endpopints
- graphql - GRAPHQL modules
- haproxy - proxy configs
- jobs - cron jobs
- models - DB data models
- next - partial next.js project, whole next.js [codegen/next](packages/dev/codegen/next)
- services - backend services that can be used to start node processes when docker container starts
- tailwind - tailwind configs
- tests - test entrypoints, setup, teardown scripts for jest and cypress
- updates - migration and update scripts

### Entrypoint package folder structure:
- same folder structure as standalone package, but with additional files:
- typestack.json
    - type stack entrypoint config file
    - add aliases for packages and provide other configuration
- appdata
    - ${alias}.env | ${alias}.${tag}.env - env variables for templates, create more templates by using env tags
    - ${alias}/ | ${alias}.${tag}/ - appdata path for docker containers
    - ${alias}.ts
    - docker-${alias}/ - docker compose files
    - next-${alias}/ - next.js project, built from partial shards