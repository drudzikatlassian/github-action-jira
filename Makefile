include help.mk

VERSION=1.5.0
BUILD_FILES=build/files

.PHONY: clean
clean: ## Clean up after the build process.
	rm -rf build

.PHONY: lint
lint: ## Lint all of the files for this Action.

.PHONY: build
build: clean package-single package-multi ## Build this Action.

.PHONY: test
test: ## Test the components of this Action.

.PHONY: publish
publish: ## Publish this Action.

generate-multi:
	$(call copyFiles)
	mv $(BUILD_DIR)/makefile.mk $(BUILD_DIR)/Makefile

generate-single:
	$(call copyFiles)
	rm -f $(BUILD_DIR)/makefile.mk
	mv $(BUILD_DIR)/action_template.mk $(BUILD_DIR)/Makefile

package-multi: BUILD_TYPE=multi-action
package-multi: BUILD_DIR=$(BUILD_FILES)/$(BUILD_TYPE)
package-multi: generate-multi
	$(call tar)

package-single: BUILD_TYPE=single-action
package-single: BUILD_DIR=$(BUILD_FILES)/$(BUILD_TYPE)
package-single: generate-single
	$(call tar)

define copyFiles
mkdir -p $(BUILD_DIR)
cp -R dockerfile_lint $(BUILD_DIR)/.dockerfile_lint
cp *.mk $(BUILD_DIR)/.
mkdir -p $(BUILD_DIR)/.github
cp ../$(BUILD_TYPE).workflow $(BUILD_DIR)/.github/main.workflow
endef

TAR_FILES=.github .dockerfile_lint *

define tar
cd $(BUILD_DIR); tar czvf ../../$(BUILD_TYPE)-template.tar.gz $(TAR_FILES)
endef
