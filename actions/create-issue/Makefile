include ../docker.mk
include ../help.mk

IMAGE_NAME=github-action-jira-cloud-create-issue

.PHONY: clean
clean: ## Clean up after the build process.

.PHONY: lint
lint: docker-lint ## Lint all of the files for this Action.

.PHONY: build
build: docker-build ## Build this Action.

.PHONY: publish
publish: docker-publish ## Publish this Action.
