FROM node:22-alpine
EXPOSE 4173

COPY . /axon
WORKDIR /axon

# this feels sketchy but apparently it's the easiest way to get pnpm to work
RUN npm install -g pnpm
RUN pnpm install

# build-lite doesn't do lint check before building
RUN pnpm run build-lite
CMD [ "pnpm", "run", "preview", "--host"]