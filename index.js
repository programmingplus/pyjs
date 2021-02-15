import { createModule } from "./pyjs";

export var run = function (code, options) {
  options = options || {};
  options.writeStdout = options.writeStdout || console.log;
  options.writeStderr = options.writeStderr || console.warn;
  options.readStdin = options.readStdin || function () {};
  if (typeof options.writeStdout !== "function") throw new Error("writeStdout must be a function");
  if (typeof options.writeStderr !== "function") throw new Error("writeStderr must be a function");
  if (typeof options.readStdin !== "function") throw new Error("readStdin must be a function");

  return createModule({
    preRun: [initModule],
  }).then(function (Module) {
    return Module.cwrap("PyJS_Run", "number", ["string"])(code);
  });

  function initModule(Module) {
    var stdinBuffer = [];
    function writeStdin(value) {
      if (!(value instanceof Uint8Array)) {
        value = new TextEncoder().encode(String(value));
      }
      for (var i = 0; i < value.length; i++) {
        stdinBuffer.push(value[i]);
      }
    }
    function ensureDataInStdin() {
      if (stdinBuffer.length) return Promise.resolve();
      return Promise.resolve(options.readStdin()).then(writeStdin);
    }
    Module.ensureDataInStdin = ensureDataInStdin;
    Module.TTY.default_tty_ops.get_char = function () {
      if (!stdinBuffer.length) return null;
      return stdinBuffer.shift();
    };

    setupPutChar(Module.TTY.default_tty_ops, options.writeStdout);
    setupPutChar(Module.TTY.default_tty1_ops, options.writeStderr);
  }

  function setupPutChar(ops, callback) {
    var rune = [];
    var charLen = 0;
    ops.put_char = function (_, u8) {
      rune.push(u8);
      if (charLen > 0) {
        charLen--;
      } else {
        if ((u8 & 0x80) === 0) charLen = 0;
        else if ((u8 & 0xe0) == 0xc0) charLen = 1;
        else if ((u8 & 0xf0) == 0xe0) charLen = 2;
        else if ((u8 & 0xf8) == 0xf0) charLen = 3;
      }
      if (charLen === 0) {
        if (typeof callback === "function") {
          callback(new TextDecoder().decode(new Uint8Array(rune)));
          rune = [];
        }
      }
    };
  }
};
