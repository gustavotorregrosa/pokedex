FROM alpine:3.15
COPY ./backendstart.sh/ /usr/local/bin/backendstart.sh
RUN chmod +x /usr/local/bin/backendstart.sh
RUN mkdir /home/app
COPY ./backend/ /home/app/
WORKDIR /home/app

RUN apk add nodejs
RUN apk add npm
RUN npm install -g yarn

EXPOSE 3001
ENTRYPOINT ["backendstart.sh"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]