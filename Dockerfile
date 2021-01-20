FROM nginx:1.17.1-alpine

# Create app directory
COPY /dist /usr/share/nginx/html
