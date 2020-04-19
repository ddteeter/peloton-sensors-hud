import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Devices from "../views/Devices.vue";
import BluetoothDeviceService from "../model/SelectableBluetoothDevice";
import BluetoothDeviceServiceType from "@/model/BluetoothDeviceServiceType";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/devices",
    name: "Devices",
    component: Devices,
    props: {
      selectableDevices: [
        new BluetoothDeviceService(BluetoothDeviceServiceType.HR, "Heart Rate"),
        new BluetoothDeviceService(
          BluetoothDeviceServiceType.SPEED_AND_CADENCE,
          "Cadence"
        ),
        new BluetoothDeviceService(BluetoothDeviceServiceType.POWER, "Power")
      ]
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
