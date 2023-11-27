## Blog (dev)

### Builds

#### Build server

docker build --tag blog-simple-server:1.0 ./

#### Build client

docker build --tag blog-simple-client-angular-material:1.0 ./webui-ng-mat

### Run stack

docker stack deploy -c blog-dev.yml blog-dev

#### SSO server docs

http://localhost:9000/swagger-ui.html

#### Blog server docs

http://localhost:9001/swagger-ui.html

#### Blog client

http://localhost:4200

### Remove stack

docker stack rm blog-dev