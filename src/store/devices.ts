import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import TypedBluetoothDevice from "@/model/TypedBluetoothDevice";
import ConnectedBluetoothDevice from "@/model/ConnectedBluetoothDevice";

export interface DevicesState {
  selectedDevices: TypedBluetoothDevice[];
  connectedDevices: ConnectedBluetoothDevice[];
}

@Module({ name: "devices" })
export class Devices extends VuexModule {
  selectedDevices: DevicesState["selectedDevices"] = [];
  connectedDevices: DevicesState["connectedDevices"] = [];

  @Mutation
  setSelectedDevice(newDevice: TypedBluetoothDevice) {
    const existingIndex = this.selectedDevices.findIndex(
      (device) => device.type === newDevice.type
    );

    if (existingIndex > -1) {
      this.selectedDevices.splice(existingIndex, 1, newDevice);
    } else {
      this.selectedDevices.push(newDevice);
    }
  }

  @Mutation
  removeSelectedDevice(toRemove: TypedBluetoothDevice) {
    const existingIndex = this.selectedDevices.findIndex(
      (device) => device.type === toRemove.type
    );

    if (existingIndex > -1) {
      this.selectedDevices.splice(existingIndex, 1);
    }
  }

  @Mutation
  setConnectedDevice(newDevice: ConnectedBluetoothDevice) {
    const existingIndex = this.connectedDevices.findIndex(
      (device) => device.type === newDevice.type
    );

    if (existingIndex > -1) {
      this.connectedDevices.splice(existingIndex, 1, newDevice);
    } else {
      this.connectedDevices.push(newDevice);
    }
  }

  @Mutation
  removeConnectedDevice(toRemove: ConnectedBluetoothDevice) {
    const existingIndex = this.connectedDevices.findIndex(
      (device) => device.type === toRemove.type
    );

    if (existingIndex > -1) {
      this.connectedDevices.splice(existingIndex, 1);
    }
  }

  @Action
  async getOrConnectDevice(
    device: TypedBluetoothDevice
  ): Promise<ConnectedBluetoothDevice> {
    let matchingDevice = this.connectedDevices.find(
      (connectedDevice) => connectedDevice.type === device.type
    );

    if (!matchingDevice?.server.connected) {
      const server = await device.device.gatt?.connect();

      if (server) {
        matchingDevice = new ConnectedBluetoothDevice(device.type, server);
        this.context.commit("setConnectedDevice", matchingDevice);
      } else {
        throw new Error(
          `Bluetooth device of type ${device.type} with id ${device.device.id} does not support GATT`
        );
      }
    }

    return matchingDevice;
  }

  @Action
  async reconnectDevice(
    device: ConnectedBluetoothDevice
  ): Promise<ConnectedBluetoothDevice> {
    let reconnectedDevice = device;

    if (!device.server.disconnect) {
      reconnectedDevice = new ConnectedBluetoothDevice(
        device.type,
        await device.server.connect()
      );

      this.context.commit("setConnectedDevice", reconnectedDevice);
    }

    return reconnectedDevice;
  }

  @Action
  removeDevice(device: TypedBluetoothDevice | ConnectedBluetoothDevice) {
    const connectedDevice = this.connectedDevices.find((connectedDevice) => {
      connectedDevice.type === device.type;
    });

    if (connectedDevice && connectedDevice.server.connected) {
      connectedDevice.server.disconnect();
      this.context.commit("removeConnectedDevice", connectedDevice);
    }

    this.context.commit("removeSelectedDevice", device);
  }
}
