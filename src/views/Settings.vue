<template>
  <div class="settings">
    <GeneralSettings />
    <Devices :selectableDevices="selectableDevices" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Devices from "@/components/Devices.vue";
import GeneralSettings from "@/components/GeneralSettings.vue";
import SelectableBluetoothDevice from "@/model/SelectableBluetoothDevice";

@Component({
  components: {
    GeneralSettings,
    Devices
  }
})
export default class Settings extends Vue {
  @Prop({ required: true })
  readonly selectableDevices!: SelectableBluetoothDevice[];
}
</script>
