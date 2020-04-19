<template>
  <div class="bluetooth-device selectable">
    <div class="status" v-if="selectedDevice !== undefined">
      <div class="reading">
        <span class="value">{{ readingValue }}</span>
      </div>
      <div class="metadata">
        <span class="name">{{ selectedDevice.name }}</span>
        <span class="id">{{ selectedDevice.id }}</span>
        <span class="type">{{ selectableDevice.displayName }}</span>
      </div>
    </div>
    <div class="bluetooth-device selection" v-else>
      <button @click="selectDevice()" v-if="!showingPicker">
        Select Device
      </button>
      <div class="metadata">
        <span class="type">{{ selectableDevice.displayName }}</span>
      </div>
      <div class="modal" v-if="showingPicker">
        <DevicePicker
          :devices="availableDevices"
          @device:selected="deviceSelected($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DevicePicker from "@/components/DevicePicker.vue";
import SelectableBluetoothDevice from "@/model/SelectableBluetoothDevice";
import BluetoothDeviceService from "@/service/renderer/BluetoothDeviceService";
import FlyweightBluetoothDevice from "@/model/FlyweightBluetoothDevice";
import TypedBluetoothDevice from "@/model/TypedBluetoothDevice";

@Component({
  components: {
    DevicePicker
  }
})
export default class Devices extends Vue {
  @Prop({ required: true })
  readonly selectableDevice!: SelectableBluetoothDevice;
  @Prop({ required: false })
  readonly selectedDevice!: TypedBluetoothDevice;
  @Prop({ required: false })
  readonly readingValue!: string | undefined;

  readonly bluetoothDeviceService: BluetoothDeviceService;

  public showingPicker = false;
  public availableDevices: FlyweightBluetoothDevice[] = [];

  constructor() {
    super();
    this.bluetoothDeviceService = new BluetoothDeviceService();
  }

  async selectDevice() {
    this.showingPicker = true;
    this.availableDevices = [];
    try {
      const selectedDevice = await this.bluetoothDeviceService.chooseDevice(
        this.selectableDevice.type,
        (devices: FlyweightBluetoothDevice[]) => {
          this.availableDevices = devices;
        }
      );
      console.info(
        `Selected device ${selectedDevice.id} ${selectedDevice.name}`
      );
      this.$emit("device:selected", selectedDevice);
    } catch (e) {
      console.info("Swallowing device selection exception", e);
    }
    this.showingPicker = false;
  }

  deviceSelected(selectedDevice: FlyweightBluetoothDevice) {
    this.bluetoothDeviceService.selectDevice(selectedDevice.deviceId);
  }
}
</script>
