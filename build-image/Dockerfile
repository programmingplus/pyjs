FROM debian:buster

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update --yes && \
    apt-get install --no-install-recommends --yes \
    build-essential \
    curl \
    git \
    libffi-dev \
    python3 \
    python3-pip \
    quilt \
    wget \
    zlib1g-dev \
    && \
    apt-get clean --yes

RUN cd /tmp && \
    git clone https://github.com/emscripten-core/emsdk.git && \
    cd emsdk && \
    ./emsdk install latest && \
    ./emsdk activate latest

COPY ./Python3-Modules-Setup.local /tmp
ENV SETUPLOCAL /tmp/Python3-Modules-Setup.local

COPY ./python-async-stdin.patch /tmp

RUN mkdir -p /tmp/python && \
    curl -sSL https://github.com/python-emscripten/python/archive/b8f7eafbb238e150f2f2e032b10d362d83b2aed6.tar.gz | tar -xvz -C /tmp/python --strip 1 && \
    cd /tmp/python/3.8 && \
    /bin/bash -c "source /tmp/emsdk/emsdk_env.sh && \
    ./python.sh unpack && \
    pushd build/Python-3.8.3 && (patch -s -p1 < /tmp/python-async-stdin.patch) && popd && \
    ./python.sh hostpython && \
    ./python.sh emscripten \
    "

VOLUME ["/tmp/pyjs"]

WORKDIR /tmp/pyjs/
COPY . /tmp/build/
CMD ["/tmp/build/build.sh"]
