FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . . 
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/meteoro-cefet /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 4200
# CMD ["npm", "start"]