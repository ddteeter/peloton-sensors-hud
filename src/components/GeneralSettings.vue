<template>
  <div class="general-settings">
    <form>
      <label for="wheels-size">Wheel Size</label>
      <input id="wheel-size" type="number" step="1" v-model="wheelSize" />
      <label for="ftp">Functional Threshold Power</label>
      <input id="ftp" type="number" step="1" v-model="ftp" />
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import { Settings as SettingsStore } from "@/store/settings";

@Component
export default class GeneralSettings extends Vue {
  private readonly settingsStore: SettingsStore;

  constructor() {
    super();
    this.settingsStore = getModule(SettingsStore, this.$store);
  }

  set wheelSize(wheelSize: number | undefined) {
    this.settingsStore.wheelSize = wheelSize;
  }

  get wheelSize() {
    return this.settingsStore.wheelSize;
  }

  set ftp(ftp: number | undefined) {
    this.settingsStore.ftp = ftp;
  }

  get ftp() {
    return this.settingsStore.ftp;
  }
}
</script>
