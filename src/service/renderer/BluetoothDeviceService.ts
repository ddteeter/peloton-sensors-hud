import BluetoothDeviceServiceType from "@/model/BluetoothDeviceServiceType";
import FlyweightBluetoothDevice from "@/model/FlyweightBluetoothDevice";
import ConnectedBluetoothDevice from "@/model/ConnectedBluetoothDevice";
import getTranslator, {
  SpeedOrCadenceConfig,
  BluetoothReadingTranslator,
} from "@/service/renderer/BluetoothReadingTranslation";
import type { IpcRenderer, IpcRendererEvent } from "electron";

declare const window: { ipcRenderer: IpcRenderer };

const ipcRenderer = window.ipcRenderer;

export default class BluetoothDeviceService {
  chooseDevice(
    type: BluetoothDeviceServiceType,
    devicesCallback: (devices: FlyweightBluetoothDevice[]) => void
  ): Promise<BluetoothDevice> {
    const availableDevicesHandler = (
      _: IpcRendererEvent,
      devices: FlyweightBluetoothDevice[]
    ) => {
      devicesCallback(devices);
    };

    ipcRenderer.on("bluetooth-devices:available", availableDevicesHandler);

    return navigator.bluetooth
      .requestDevice({
        filters: [
          {
            services: [type],
          },
        ],
      })
      .finally(() => {
        ipcRenderer.removeListener(
          "bluetooth-devices:available",
          availableDevicesHandler
        );
      });
  }

  selectDevice(deviceId: string): void {
    console.info(`Transmitting selection for device with id ${deviceId}`);
    ipcRenderer.send("bluetooth-devices:selected", deviceId);
  }

  async startReading(
    connectedDevice: ConnectedBluetoothDevice,
    onReading: (value: string) => void,
    speedOrCadenceConfig?: SpeedOrCadenceConfig
  ): Promise<ConnectedBluetoothDevice> {
    let translator: BluetoothReadingTranslator;
    if (connectedDevice.type === BluetoothDeviceServiceType.SPEED_AND_CADENCE) {
      if (speedOrCadenceConfig === undefined) {
        throw new Error(
          `Missing configuration options for ${connectedDevice.type}`
        );
      }
      translator = getTranslator({
        type: connectedDevice.type,
        options: speedOrCadenceConfig,
      });
    } else {
      translator = getTranslator({ type: connectedDevice.type });
    }

    const characterstic = await this.getPrimaryCharacterstic(connectedDevice);
    await characterstic.startNotifications();

    characterstic.addEventListener(
      "characteristicvaluechanged",
      (event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (value) {
          const translatedValue = translator.translateValue(value);
          if (translatedValue !== undefined) {
            onReading(translatedValue);
          }
        }
      }
    );

    return connectedDevice;
  }

  async stopReading(
    connectedDevice: ConnectedBluetoothDevice
  ): Promise<ConnectedBluetoothDevice> {
    const characteristic = await this.getPrimaryCharacterstic(connectedDevice);
    await characteristic.stopNotifications();

    return connectedDevice;
  }

  private async getPrimaryCharacterstic(
    connectedDevice: ConnectedBluetoothDevice
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    const service = await connectedDevice.server.getPrimaryService(
      this.getPrimaryService(connectedDevice.type)
    );
    return await service.getCharacteristic(
      this.getCharacteristic(connectedDevice.type)
    );
  }

  private getPrimaryService(type: BluetoothDeviceServiceType): string {
    let service;

    switch (type) {
      case BluetoothDeviceServiceType.HR:
        service = "heart_rate";
        break;
      case BluetoothDeviceServiceType.POWER:
        service = "cycling_power";
        break;
      case BluetoothDeviceServiceType.SPEED_AND_CADENCE:
        service = "cycling_speed_and_cadence";
        break;
      default:
        throw new Error(`Unknown Bluetooth device service type: ${type}`);
    }

    return service;
  }

  private getCharacteristic(type: BluetoothDeviceServiceType): string {
    let service;

    switch (type) {
      case BluetoothDeviceServiceType.HR:
        service = "heart_rate_measurement";
        break;
      case BluetoothDeviceServiceType.POWER:
        service = "cycling_power_measurement";
        break;
      case BluetoothDeviceServiceType.SPEED_AND_CADENCE:
        service = "csc_measurement";
        break;
      default:
        throw new Error(`Unknown Bluetooth device service type: ${type}`);
    }

    return service;
  }
}
