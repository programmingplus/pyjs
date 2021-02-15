mergeInto(LibraryManager.library, {
  emscripten_ensure_data_in_stdin: function () {
    return Asyncify.handleAsync(function () {
      var ensureDataInStdin = Module["ensureDataInStdin"];
      if (typeof ensureDataInStdin === "function") return ensureDataInStdin();
    });
  },
});
