<template>
  <div class="home">
    <div style="position: absolute; bottom: 0px; height: 30px;">
      In Video: {{ inVideo }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ipcRenderer } from "electron";

@Component
export default class Home extends Vue {
  inVideo = false;

  created() {
    ipcRenderer.send("peloton-window:show");
    ipcRenderer.on(
      "peloton:in-video",
      (_: Electron.Event, inVideo: boolean) => {
        console.log("In Video", inVideo);
        this.inVideo = inVideo;
      }
    );
  }

  destroyed() {
    ipcRenderer.send("peloton-window:hide");
  }
}
</script>
