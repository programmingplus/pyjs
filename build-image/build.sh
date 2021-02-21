#!/bin/bash -ex
source /tmp/emsdk/emsdk_env.sh
export NODE_OPTIONS="--max-old-space-size=8192"

BASE_URL=$(dirname $(readlink -f $0))
PYTHON_DEST=/tmp/python/3.8/destdir
PACKAGE_DIR=/tmp/package
DIST_DIR=pyjs-build

mkdir -p $DIST_DIR

mkdir -p $PACKAGE_DIR/lib
${BASE_URL}/prepare-stdlib.py

emcc -o $DIST_DIR/pyjs.js pyjs.c \
    -O3 \
    -I$PYTHON_DEST/include/python3.8 -L$PYTHON_DEST/lib -lpython3.8 \
    -s EMULATE_FUNCTION_POINTER_CASTS=1 \
    -s USE_ZLIB=1 \
    -s FETCH=1 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s FORCE_FILESYSTEM=1 -s RETAIN_COMPILER_SETTINGS=1 \
    -s MODULARIZE=1 \
    -s EXPORTED_FUNCTIONS='[_PyJS_Run]' \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='[ccall, cwrap, FS, TTY]' \
    -s ASYNCIFY -s ASYNCIFY_IMPORTS=["emscripten_ensure_data_in_stdin"] \
    --preload-file $PACKAGE_DIR@/ --exclude-file "*__pycache__*" --exclude-file "*/test/*" \
    --use-preload-cache --no-heap-copy \
    --js-library library.js -s WASM=0
