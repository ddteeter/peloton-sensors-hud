import BluetoothDeviceServiceType from "./BluetoothDeviceServiceType";

export default class TypedBluetoothDevice {
  constructor(
    public readonly type: BluetoothDeviceServiceType,
    public readonly device: BluetoothDevice
  ) {}
}
