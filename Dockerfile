# stage 1 - build the application with vite
FROM node:22-alpine as build

COPY . /axon
WORKDIR /axon

# this feels sketchy but apparently it's the easiest way to get pnpm to work
RUN npm install -g pnpm
RUN pnpm install

# build-lite doesn't do lint check before building
RUN pnpm run build-lite

# stage 2 - serve the application using caddy
FROM caddy:alpine 

COPY --from=build /axon/dist /usr/share/caddy

EXPOSE 4173
CMD ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":4173"]
