FROM rust:1-alpine

RUN apk add musl-dev

RUN cargo install --version 0.4.48 mdbook

EXPOSE 3000

ENTRYPOINT [ "mdbook" ]
