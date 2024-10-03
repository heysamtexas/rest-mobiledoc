##########################################################################
# MENU
##########################################################################
.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*?## "} /^[0-9a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: docker
docker: ## Build the docker container
	docker build -t rest-mobiledoc .

.PHONY: docker-run
docker-run: ## Run the docker container
	docker run --rm -e URI_PATH=/mobiledoc/ -it -p 3000:3000 rest-mobiledoc

.PHONY: test
test: ## Run the tests
	npm test