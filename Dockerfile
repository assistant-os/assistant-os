###############################################################################
# Step 1 : Builder image
#
FROM mhart/alpine-node:10 AS builder

# Define working directory and copy source
WORKDIR /app
COPY . .
RUN yarn config set cache ~/.yarn-cache
# Install dependencies and build whatever you have to build
# (babel, grunt, webpack, etc.)
RUN yarn --mutex network
RUN yarn
RUN yarn build

###############################################################################
# Step 2 : Run image
#
FROM node:10-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

# RUN npx lerna bootstrap --production

# Copy builded source from the upper builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 8080

# Start the app
CMD ["node", "dist/app.js"]
