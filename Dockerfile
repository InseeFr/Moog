FROM nginx:stable-alpine
COPY build /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx-frontmoog.conf etc/nginx/conf.d/

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./scripts/env.sh .
COPY .env .

# Make shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
