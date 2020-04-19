<template>
  <div class="about">
    <h1>Devices</h1>
    <div class="devices">
      <Device
        v-for="device in mergedDevices"
        :key="device.selectable.type"
        :selectableDevice="device.selectable"
        :selectedDevice="device.selected"
        :readingValue="device.reading"
        @device:selected="deviceSelected(device.selectable.type, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Device from "@/components/Device.vue";
import SelectableBluetoothDevice from "@/model/SelectableBluetoothDevice";
import { Devices as DevicesStore } from "@/store/devices";
import BluetoothDeviceServiceType from "@/model/BluetoothDeviceServiceType";
import TypedBluetoothDevice from "@/model/TypedBluetoothDevice";
import TypedBluetoothDeviceReading from "@/model/TypedBluetoothDeviceReading";
import BluetoothDeviceService from "../service/renderer/BluetoothDeviceService";
import { getModule } from "vuex-module-decorators";

@Component({
  components: {
    Device
  }
})
export default class Devices extends Vue {
  @Prop({ required: true })
  readonly selectableDevices!: SelectableBluetoothDevice[];

  readonly bluetoothDeviceService: BluetoothDeviceService;

  private devicesModule: DevicesStore;

  readingValues: TypedBluetoothDeviceReading[] = [];

  constructor() {
    super();
    this.bluetoothDeviceService = new BluetoothDeviceService();
    this.devicesModule = getModule(DevicesStore, this.$store);
  }

  destroyed() {
    this.devicesModule.connectedDevices.forEach((device) =>
      this.bluetoothDeviceService.stopReading(device).catch((e) => {
        console.error("Unable to stop reading from device", device, e);
      })
    );
  }

  async deviceSelected(
    deviceType: BluetoothDeviceServiceType,
    device: BluetoothDevice
  ) {
    const typedDevice = new TypedBluetoothDevice(deviceType, device);
    this.devicesModule.setSelectedDevice(typedDevice);
    const connctedDevice = await this.devicesModule.getOrConnectDevice(
      typedDevice
    );
    let connected = false;
    for (let attempts = 0; !connected && attempts < 5; ++attempts) {
      try {
        await this.bluetoothDeviceService.startReading(
          connctedDevice,
          (readingValue) => {
            const existingReadingIndex = this.readingValues.findIndex(
              (device) => device.type === connctedDevice.type
            );

            const reading = new TypedBluetoothDeviceReading(
              connctedDevice.type,
              readingValue
            );

            if (existingReadingIndex > -1) {
              this.readingValues.splice(existingReadingIndex, 1, reading);
            } else {
              this.readingValues.push(reading);
            }
          }
        );
        connected = true;
      } catch (e) {
        console.error(
          "Unable to start reading from device -- failed after 5 attempts",
          connctedDevice,
          e,
          e.message
        );
      }
    }
  }

  get mergedDevices() {
    return this.selectableDevices.map((selectableDevice) => {
      return {
        selectable: selectableDevice,
        selected: this.devicesModule.selectedDevices.find(
          (device) => device.type == selectableDevice.type
        ),
        reading: (
          this.readingValues.find(
            (reading) => reading.type == selectableDevice.type
          ) || { value: undefined }
        ).value
      };
    });
  }
}
</script>
