import Vue from "vue";
import Vuex from "vuex";
import { DevicesState, Devices } from "@/store/devices";

Vue.use(Vuex);

export interface RootState {
  devices: DevicesState;
}

const store = new Vuex.Store<RootState>({
  modules: {
    devices: Devices
  }
});

export default store;
