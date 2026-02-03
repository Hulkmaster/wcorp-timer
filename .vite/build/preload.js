"use strict";
const renderer = require("electron/renderer");
renderer.contextBridge.exposeInMainWorld("electronAPI", {
  setIgnoreMouseEvents: (ignore, options) => renderer.ipcRenderer.send("set-ignore-mouse-events", ignore, options),
  minimize: () => renderer.ipcRenderer.send("minimize"),
  close: () => renderer.ipcRenderer.send("close")
});
