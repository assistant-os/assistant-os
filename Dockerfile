###############################################################################
# Step 1 : Builder image
#
FROM mhart/alpine-node:10 AS builder

# Define working directory and copy source
WORKDIR /app
COPY packages packages
COPY scripts scripts
COPY webpack.config.js .
COPY lerna.json .
COPY package.json .
COPY yarn.lock .
RUN yarn config set cache ~/.yarn-cache
# Install dependencies and build whatever you have to build
# (babel, grunt, webpack, etc.)
RUN npx lerna bootstrap --mutex network
RUN yarn webpack

###############################################################################
# Step 2 : Run image
#
FROM node:9-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

# Install deps for production only
COPY ./package* ./
# Copy builded source from the upper builder stage
COPY --from=builder /app/build ./build

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 8080

# Start the app
CMD ["node", "dist/app.js"]
