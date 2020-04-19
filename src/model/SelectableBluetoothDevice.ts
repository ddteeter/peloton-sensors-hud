import BluetoothDeviceServiceType from "./BluetoothDeviceServiceType";

export default class SelectableBluetoothDevice {
  constructor(
    public readonly type: BluetoothDeviceServiceType,
    public readonly displayName: string
  ) {}
}
