# Construir o Angular
FROM node:alpine as build
WORKDIR /app

# Copiar o código do Angular
COPY client/ /app/

# Construir o app Angular

RUN npm cache clean --force

RUN npm install

RUN npm run build --prod

# Configurar o servidor Nginx para servir o aplicativo Angular
FROM nginx:alpine

# Copiar o conteúdo do diretório "dist" do Angular para a pasta do Nginx
COPY --from=build /app/dist/meteoro-cefet /usr/share/nginx/html

# Copiar o arquivo de configuração do Nginx para substituir o padrão
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80
