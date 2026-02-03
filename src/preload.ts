// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron/renderer';

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore: boolean, options?: Electron.IgnoreMouseEventsOptions) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),
})
