#!/usr/bin/env python3
from os import chdir, makedirs, path
from glob import glob
from shutil import copy

chdir("/tmp/python/3.8/destdir/lib")
for filename in glob("./**/*.cpython-38.opt-2.pyc", recursive=True):
    dst = filename.replace("__pycache__/", "").replace(".cpython-38.opt-2", "")
    dst = f"/tmp/package/lib/{dst}"
    makedirs(path.dirname(dst), exist_ok=True)
    copy(filename, dst)
