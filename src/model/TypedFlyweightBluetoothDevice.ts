import BluetoothDeviceServiceType from "./BluetoothDeviceServiceType";

export default class TypedFlyweightBluetoothDevice {
  constructor(
    public readonly type: BluetoothDeviceServiceType,
    public readonly id: string
  ) {}
}
