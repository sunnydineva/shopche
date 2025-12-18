# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Enable source maps and debugging
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=true
RUN npm install -g typescript && npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy source maps for debugging
COPY --from=build /app/src /usr/share/nginx/html/src
EXPOSE 80
# Add debug logging to nginx
CMD ["nginx", "-g", "daemon off; error_log /dev/stdout debug;"]
