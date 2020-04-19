import BluetoothDeviceServiceType from "./BluetoothDeviceServiceType";

export default class TypedBluetoothDeviceReading {
  constructor(
    public readonly type: BluetoothDeviceServiceType,
    public readonly value: string
  ) {}
}
