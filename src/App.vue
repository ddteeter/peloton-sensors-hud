<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/settings">Settings</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Devices as DevicesStore } from "@/store/devices";
import TypedBluetoothDeviceReading from "@/model/TypedBluetoothDeviceReading";
import BluetoothDeviceService from "@/service/renderer/BluetoothDeviceService";
import { getModule } from "vuex-module-decorators";
import SettingsPersistenceService from "./service/renderer/SettingsPersistenceService";

@Component
export default class App extends Vue {
  readonly bluetoothDeviceService: BluetoothDeviceService;
  readonly settingsPersistenceService: SettingsPersistenceService;

  private devicesModule: DevicesStore;

  readingValues: TypedBluetoothDeviceReading[] = [];

  constructor() {
    super();
    this.bluetoothDeviceService = new BluetoothDeviceService();
    this.settingsPersistenceService = new SettingsPersistenceService();
    this.devicesModule = getModule(DevicesStore, this.$store);
  }

  created() {
    // TODO: Load selected devices and reconnect if possible.
    // Likely requires calling requestDevice and automatically detecing it is already selecting.
    // We have to have some way of getting the hook to the BluetoothDevice again.
  }
}
</script>
