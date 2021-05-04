# Static web site compiler
FROM node:14 as builder

ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}
ARG NODE_ENV="development"
ENV NODE_ENV=${NODE_ENV}
ARG ETH_NETWORK_ID
ENV ETH_NETWORK_ID=${ETH_NETWORK_ID}
ARG BLOCK_TIME
ENV BLOCK_TIME=${BLOCK_TIME}
ARG BOOTNODES_URL="https://bootnodes.vocdoni.net/gateways.dev.json"
ENV BOOTNODES_URL=${BOOTNODES_URL}

WORKDIR /app
ADD package.json /app
# ADD package-lock.json /app
RUN npm install

ADD . /app
RUN npm run export

FROM node:14

RUN apt update && apt install nginx -y && apt clean

COPY --from=builder /app /app

WORKDIR /app

ENTRYPOINT [ "/app/entrypoint.sh" ]
