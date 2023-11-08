FROM rust:1-alpine

RUN apk add musl-dev

RUN cargo install mdbook

ENTRYPOINT [ "mdbook" ]
