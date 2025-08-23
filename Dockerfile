FROM node:22-alpine
LABEL version="1.0" maintainer="Espen Hovlandsdal <espen@hovlandsdal.com>"

WORKDIR /srv/app

# Install app dependencies (pre-source copy in order to cache dependencies)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Bundle app source
COPY . .

# Build
RUN npm run build

CMD [ "npm", "run", "preview"]
