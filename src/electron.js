const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    addUser: (user) => ipcRenderer.invoke("add-user", user),
    getUser: (userId) => ipcRenderer.invoke("get-user", userId),
});
