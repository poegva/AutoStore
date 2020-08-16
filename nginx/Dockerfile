FROM nginx:1.17.4-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

#COPY store.crt /etc/nginx/ssl/store.crt
#COPY store.key /etc/nginx/ssl/store.key