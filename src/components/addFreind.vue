<template>
  <v-window :model-value="tabProps">
    <v-window-item value="scan">
      <StreamBarcodeReader v-if="mounted" @decode="onDecoded" />
    </v-window-item>
    <v-window-item value="upload">
      <ImageBarcodeReader v-if="mounted" @decode="onDecoded" @error="onError" />
    </v-window-item>
  </v-window>
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-title>{{ userAdded }}</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="handleAddFreind"> Add this User </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { StreamBarcodeReader, ImageBarcodeReader } from "vue-barcode-reader";
import { store } from "@/store";
import socket from "@/services/socketio.service";
export default defineComponent({
  name: "addHero",
  components: {
    StreamBarcodeReader,
    ImageBarcodeReader,
  },
  data() {
    return {
      mounted: false,
      dialog: false,
      userAdded: "",
    };
  },
  computed: {
    tab() {
      return this.tabProps;
    },
  },
  props: {
    tabProps: String,
  },
  emits: ["decode"],
  methods: {
    handleAddFreind() {
      socket.emit("addFreind", this.userAdded);
      this.$emit("decode");
      store.commit("setToast", {
        visible: true,
        color: "success",
        title: "Adding freind success, enjoy your chatting with new freind",
      });
    },
    onDecoded(v: string) {
      this.userAdded = v;
      this.dialog = true;
    },
    onError(v: string) {
      console.log(v);
    },
  },
  mounted() {
    this.mounted = true;
  },
  unmounted() {
    this.mounted = false;
  },
});
</script>
