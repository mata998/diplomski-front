# React image
FROM node:14 as build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Prepare nginx
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Fire up nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]