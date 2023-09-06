FROM alpine:3.15
COPY ./emailstart.sh/ /usr/local/bin/emailstart.sh
RUN chmod +x /usr/local/bin/emailstart.sh
RUN mkdir /home/app
COPY ./email-service/ /home/app/
WORKDIR /home/app

RUN apk add nodejs
RUN apk add npm
RUN npm install -g yarn

ENTRYPOINT ["emailstart.sh"]
