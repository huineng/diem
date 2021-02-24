FROM node:13.0.1-alpine

LABEL maintainer=guy_huinen@be.ibm.com
LABEL com.ibm.service.name=leap
LABEL com.ibm.service.component=expo
LABEL com.ibm.service.version=1
LABEL com.ibm.service.component.version=1

ENV LANG=en_US.UTF-8 HOME=/home/app NODE_ENV=production

ADD app.js package.json package-lock.json $HOME/

RUN cd $HOME && npm ci --production && npm audit fix

WORKDIR $HOME

CMD [ "npm", "start" ]