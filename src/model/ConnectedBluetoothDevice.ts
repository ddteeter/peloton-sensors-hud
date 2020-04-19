import BluetoothDeviceServiceType from "./BluetoothDeviceServiceType";

export default class ConnectedBluetoothDevice {
  constructor(
    public readonly type: BluetoothDeviceServiceType,
    public readonly server: BluetoothRemoteGATTServer
  ) {}
}
