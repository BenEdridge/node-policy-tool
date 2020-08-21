# Builder
FROM node:14.8.0-alpine3.11 as builder
WORKDIR /usr/src/app
COPY . .

RUN npm ci

# Final Image
FROM node:14.8.0-alpine3.11 
WORKDIR /usr/src/app

# DISABLE npm update checker...
# https://docs.npmjs.com/misc/config#update-notifier
ENV NO_UPDATE_NOTIFIER true

# Node Modules
COPY --from=builder --chown=node:node /usr/src/app/node_modules node_modules

# Source
COPY --chown=node:node index.js package*.json .npmrc ./

# POLICY FILE
# https://www.projectatomic.io/blog/2015/12/making-docker-images-write-only-in-production/
COPY --chown=root:root policy.json policy.json
RUN chmod 444 ./policy.json

USER node
CMD [ "npm", "run", "start:non-secure" ]

EXPOSE 8080