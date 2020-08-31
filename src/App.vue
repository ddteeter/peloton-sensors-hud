<template>
  <div id="app">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex space-x-4 h-12">
          <router-link
            to="/"
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            >Home</router-link
          >

          <router-link
            to="/settings"
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            >Settings</router-link
          >
        </div>
      </div>
    </nav>
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

  created(): void {
    // TODO: Load selected devices and reconnect if possible.
    // Likely requires calling requestDevice and automatically detecing it is already selecting.
    // We have to have some way of getting the hook to the BluetoothDevice again.
  }
}
</script>
