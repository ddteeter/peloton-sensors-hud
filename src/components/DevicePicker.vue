<template>
  <div class="device-picker">
    <ul>
      <li v-for="device in devices" :key="device.deviceId">
        <div class="device">
          <div class="metadata">
            <span class="name">{{ device.displayName }}</span>
            <span class="id">{{ device.deviceId }}</span>
          </div>
          <button @click="selectDevice(device)">Select</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import FlyweightBluetoothDevice from "@/model/FlyweightBluetoothDevice";

@Component
export default class DevicePicker extends Vue {
  @Prop({ required: true })
  readonly devices!: FlyweightBluetoothDevice[];

  public selectDevice(device: FlyweightBluetoothDevice) {
    this.$emit("device:selected", device);
  }
}
</script>
