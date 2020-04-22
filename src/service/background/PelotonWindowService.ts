import { ipcMain, BrowserView, BrowserWindow } from "electron";

export default class PelotonWindowService {
  private showListener: () => void;
  private hideListener: () => void;
  private pelotonInVideoListener: (_: Electron.Event, inVideo: boolean) => void;

  constructor(browserWindow: BrowserWindow, openDevTools: boolean) {
    const browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        preload: `${__static}/peloton/preload.js`
      }
    });
    if (openDevTools) {
      browserView.webContents.openDevTools({ mode: "detach" });
    }
    browserView.setAutoResize({ width: true, height: true });
    browserView.setBounds({
      x: 0,
      y: 30,
      width: browserWindow.getSize()[0],
      height: browserWindow.getSize()[1] - 150
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
