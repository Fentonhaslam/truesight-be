# custom build for shared layer (aws sam does not support esbuild for layers yet)
.PHONY: build-SharedLayer

build-SharedLayer:
	esbuild **/*.ts --bundle --minify --sourcemap --platform=node --target=es2020 --outdir="$(ARTIFACTS_DIR)/nodejs/node_modules"
