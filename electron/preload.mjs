import { contextBridge, ipcRenderer } from "electron";

function subscribe(channel, callback) {
  if (typeof callback !== "function") {
    throw new TypeError("Window event callback must be a function");
  }

  const listener = () => callback();
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld("desktop", {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  minimizeWindow: () => ipcRenderer.invoke("window:minimize"),
  toggleMaximizeWindow: () => ipcRenderer.invoke("window:toggle-maximize"),
  closeWindow: () => ipcRenderer.invoke("window:close"),
  onWindowFocus: (callback) => subscribe("window:focus", callback),
  onWindowBlur: (callback) => subscribe("window:blur", callback),
});