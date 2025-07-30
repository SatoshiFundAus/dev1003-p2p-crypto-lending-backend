# Shared between both development and production

FROM node:alpine AS build

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

ARG PORT=3000
ENV PORT=${PORT}

# Dockerfile expects ARG valuse to be provided by docker-compose
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 3000

# -----------------
# For development
# ------------------
FROM build AS development

CMD [ "npm", "run", "dev" ]


# -----------------
# For testing
# ------------------
FROM build AS test

ENV NODE_ENV=test

CMD [ "npm", "test" ]


# ---------------
# For production
# ---------------

FROM build AS production

ARG NODE_ENV=production
ENV NODE_ENV=production

# Investigate an alternative to CI as it only do
# npm install --omit=dev
RUN npm ci --only=production

CMD [ "npm", "start" ]


EXPOSE ${PORT}

