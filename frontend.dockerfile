FROM alpine:3.15
COPY ./frontendstart.sh/ /usr/local/bin/frontendstart.sh
RUN chmod +x /usr/local/bin/frontendstart.sh
RUN mkdir /home/app
COPY ./frontend/ /home/app/
WORKDIR /home/app

RUN apk add nodejs
RUN apk add npm
RUN npm install -g yarn

EXPOSE 3000
ENTRYPOINT ["frontendstart.sh"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]