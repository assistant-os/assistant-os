###############################################################################
# Step 1 : Builder image
#
FROM node:9-alpine AS builder

# Define working directory and copy source
WORKDIR /home/node/app
COPY . .

RUN yarn config set cache ~/.yarn-cache
# Install dependencies and build whatever you have to build
# (babel, grunt, webpack, etc.)
RUN npx lerna bootstrap
run yarn webpack

###############################################################################
# Step 2 : Run image
#
FROM node:9-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

# Install deps for production only
COPY ./package* ./
# Copy builded source from the upper builder stage
COPY --from=builder /home/node/app/build ./build

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 8080

# Start the app
CMD ["node", "dist/app.js"]
