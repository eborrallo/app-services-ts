FROM zenko/cloudserver:latest-8.2 as development
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |  apt-key add -
RUN apt update && apt install awscli -y

COPY rootfs-dev/ /
