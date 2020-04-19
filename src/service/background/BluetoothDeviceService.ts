import { BrowserWindow, IpcMain } from "electron";
import BluetoothDevice from "@/model/FlyweightBluetoothDevice";

export default class BluetoothDeviceService {
  private latestCallback: (deviceId: string) => void;

  constructor(readonly ipcMain: IpcMain) {
    this.latestCallback = () => {
      // no-op
    };
    ipcMain.on(
      "bluetooth-devices:selected",
      (_: Electron.Event, deviceId: string) => {
        this.latestCallback(deviceId);
      }
    );
  }

  handleDevices(window: BrowserWindow): void {
    window.webContents.on(
      "select-bluetooth-device",
      (event, devices, callback) => {
        event.preventDefault();
        console.debug("select-bluetooth-device", devices);
        window.webContents.send(
          "bluetooth-devices:available",
          devices.map(
            (device) => new BluetoothDevice(device.deviceName, device.deviceId)
          )
        );
        this.latestCallback = callback;
      }
    );
  }
}
