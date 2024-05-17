FROM nginx:stable-alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

ADD build /usr/share/nginx/html

RUN rm etc/nginx/conf.d/default.conf
COPY nginx.conf etc/nginx/conf.d/

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

# Add bash
RUN apk add --no-cache bash

COPY ./scripts/env.sh .
COPY .env .

# Make shell script executable
RUN chmod +x env.sh

# add non-root user
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# non root users cannot listen on 80
EXPOSE 8080

USER nginx

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
