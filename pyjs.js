import Module from "./pyjs-build/pyjs";
import pyjsMem from "./pyjs-build/pyjs.js.mem";
import pyjsData from "./pyjs-build/pyjs.data";

export var locateFile = function (filename, prefix) {
  switch (filename) {
    case "pyjs.wasm":
      return "";
    case "pyjs.js.mem":
      return pyjsMem;
    case "pyjs.data":
      return pyjsData;
    default:
      throw new Error(`unexpected file ${prefix}${filename}`);
  }
};

export var createModule = function (opts) {
  opts = opts || {};
  opts.locateFile = opts.locateFile || locateFile;
  return Module(opts);
};
