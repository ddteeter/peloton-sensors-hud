"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import BluetoothDeviceService from "./service/background/BluetoothDeviceService";
import PelotonWindowService from "./service/background/PelotonWindowService";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
const bluetoothDeviceService = new BluetoothDeviceService(ipcMain);
let pelotonWindowService: PelotonWindowService;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
let isDevAndNotTest = false;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    title: "Peloton Sensors HUD",
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });
  win.maximize();
  win.show();
  win.setMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: "detach" });
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });

  bluetoothDeviceService.handleDevices(win);
  if (pelotonWindowService) {
    pelotonWindowService.deregister();
  }
  pelotonWindowService = new PelotonWindowService(win, isDevAndNotTest);
}

if (process.platform === "linux") {
  // Linux needs experimental features to enable web bluetooth
  app.commandLine.appendSwitch(
    "enable-experimental-web-platform-features",
    "true);"
  );
}
app.commandLine.appendSwitch("enable-web-bluetooth", "true");

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  isDevAndNotTest = isDevelopment && !process.env.IS_TEST;
  if (isDevAndNotTest) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
