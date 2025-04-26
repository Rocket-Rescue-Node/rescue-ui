SOURCES := $(shell find src)

.PHONY: build
build:
	CURRENT_USER=$(shell id -u):$(shell id -g) docker compose build

.PHONY: docs
docs: $(SOURCES) book.toml
	CURRENT_USER=$(shell id -u):$(shell id -g) docker compose run --remove-orphans mdbook-build

.PHONY: serve
serve: docs
	CURRENT_USER=$(shell id -u):$(shell id -g) docker compose up --remove-orphans mdbook-serve

