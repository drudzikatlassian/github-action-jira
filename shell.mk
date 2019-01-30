SHELL_FILES=$(wildcard *.sh */*.sh)
BATS_TESTS=$(wildcard *.bats */*.bats)

.PHONY: shell-lint
shell-lint:
	shellcheck $(SHELL_FILES)