export interface IElectronAPI {
  setIgnoreMouseEvents: (ignore: boolean, options?: Electron.IgnoreMouseEventsOptions) => Promise<void>,
  minimize: () => Promise<void>,
  close: () => Promise<void>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
