#include <emscripten.h>
#include <Python.h>

int PyJS_Run(char *s) {
  Py_OptimizeFlag = 2; // look for .pyo rather than .pyc
  Py_FrozenFlag = 1; // drop <exec_prefix> warnings

  Py_InitializeEx(0);
  int ret = PyRun_SimpleString(s);
  Py_Finalize();

  return ret;
}
