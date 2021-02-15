BUILD_IMAGE_NAME=programmingplus/pyjs-build

.PHONY : build build-image
build : build-image
	docker run -itv $(shell pwd):/tmp/pyjs/ $(BUILD_IMAGE_NAME)

build-image :
	docker build ./build-image -t $(BUILD_IMAGE_NAME)
