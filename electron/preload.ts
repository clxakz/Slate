import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld("api", {
    send: (channel: string, args: any) => ipcRenderer.invoke(channel, args),
    onUpdateAvailable: (callback: any) => {
        const listener = (_: any, info: any) => callback(info);
        ipcRenderer.on('update-available', listener);
        return () => {
        ipcRenderer.removeListener('update-available', listener);
        };
    },

    onUpdateProgress: (callback: any) => {
        const listener = (_event: any, progress: any) => callback(progress);
        ipcRenderer.on("update-download-progress", listener);
        return () => ipcRenderer.removeListener("update-download-progress", listener);
    },
})