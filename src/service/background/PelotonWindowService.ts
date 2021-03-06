import { ipcMain, BrowserView, BrowserWindow } from "electron";

declare const __static: string;

export default class PelotonWindowService {
  private showListener: () => void;
  private hideListener: () => void;
  private pelotonInVideoListener: (_: Electron.Event, inVideo: boolean) => void;

  constructor(browserWindow: BrowserWindow, openDevTools: boolean) {
    const browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        preload: `${__static}/peloton/preload.js`,
      },
    });
    browserWindow.setBrowserView(browserView);
    if (openDevTools) {
      browserView.webContents.openDevTools({ mode: "detach" });
    }
    browserView.setAutoResize({ horizontal: true, vertical: true });
    browserView.setBounds({
      x: 0,
      y: 48,
      width: browserWindow.getSize()[0],
      height: browserWindow.getSize()[1] - 168,
    });
    browserView.webContents.loadURL("https://members.onepeloton.com");

    this.showListener = () => {
      browserWindow.addBrowserView(browserView);
    };
    ipcMain.on("peloton-window:show", this.showListener);

    this.hideListener = () => {
      browserWindow.removeBrowserView(browserView);
    };
    ipcMain.on("peloton-window:hide", this.hideListener);

    this.pelotonInVideoListener = (_: Electron.Event, inVideo: boolean) => {
      browserWindow.webContents.send("peloton:in-video", inVideo);
    };
    ipcMain.on("peloton:in-video", this.pelotonInVideoListener);
  }

  deregister(): void {
    ipcMain.removeListener("peloton-window:show", this.showListener);
    ipcMain.removeListener("peloton-window:hide", this.hideListener);
    ipcMain.removeListener("peloton:in-video", this.pelotonInVideoListener);
  }
}
