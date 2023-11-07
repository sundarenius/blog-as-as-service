FROM node:16.10-slim

RUN apt-get update && apt-get install -y curl gnupg

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarn-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/yarn-archive-keyring.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

# OWN CONTENT
RUN useradd -m myuser
WORKDIR /app
COPY package.json .
COPY . .

ARG APP_ENV

ENV APP_ENV=${APP_ENV}

RUN echo ${APP_ENV}
RUN yarn install --network-timeout 1000000

CMD ["sh", "./start-cmd.sh"]
