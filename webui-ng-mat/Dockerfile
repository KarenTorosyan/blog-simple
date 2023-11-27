FROM node:20.10.0-alpine3.18 as builder
WORKDIR /opt/blog
COPY --chown=node:node . .
RUN npm install
RUN npm run build

FROM nginx:1.25-bookworm
WORKDIR /usr/share/nginx/html
COPY --from=builder /opt/blog/dist/webui-ng-mat ./
COPY nginx.conf /etc/nginx/nginx.conf
CMD nginx -g 'daemon off;'
