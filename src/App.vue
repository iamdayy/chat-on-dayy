<template>
  <v-snackbar
    v-model="$store.state.toast.visible"
    location="top center"
    position="fixed"
    :color="$store.state.toast.color"
    max-width="300"
    :timeout="3000"
    class="mt-4"
    >{{ $store.state.toast.title }}
    <template v-slot:actions>
      <v-btn
        color="blue"
        variant="text"
        @click="$store.state.toast.visible = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import socket from "@/services/socketio.service";
import { LocalNotificationSchema } from "@capacitor/local-notifications";
import { user } from "./types";
import { Notification } from "@/services/notify.service";
import { DeviceInfo } from "@/services/device.service";
export default defineComponent({
  components: {},
  beforeCreate() {
    this.$store.dispatch("onInit");
  },
  mounted() {
    DeviceInfo();
    const notifyData: LocalNotificationSchema = {
      title: "Welcome To chat on day",
      body: "enjoy your chat",
      id: 1,
      schedule: {
        at: new Date(Date.now()),
      },
    };
    const notif = new Notification();
    notif.notifTrigger(notifyData);
    // socket.on("users", (users: user[]) => {
    //   store.state.users = users;
    // });
    // socket.on("userConnected", (id: string) => {
    //   store.state.users.forEach((user: user) => {
    //     if (user._id === id) user.connected = true;
    //   });
    // });
    socket.on("addFreind", (user: user) => {
      this.$store.state.me.requestFreind.push(user);
      notif.notifTrigger({
        title: "new request freind",
        body: "You have new request freind from " + user.username,
        id: 2,
      });
      this.$store.commit("setToast", {
        visible: true,
        color: "success",
        title: "You have new request to freind",
      });
    });
    socket.on("requestAccepted", (user: user) => {
      this.$store.state.users.push(user);
      const indexUser = this.$store.state.me.requestFreind.indexOf(user);
      notif.notifTrigger({
        title: "You have new freind",
        body: "Your request to freind has accepted, enjoy your chat",
        id: 3,
      });
      this.$store.state.me.requestFreind.splice(indexUser, 1);
      this.$store.commit("setToast", {
        visible: true,
        color: "success",
        title: "Adding freind success, enjoy your chatting with new freind",
      });
    });
    socket.on("private message", ({ content, from, to }) => {
      for (let i = 0; i < this.$store.state.users.length; i++) {
        const user: user = this.$store.state.users[i];
        notif.notifTrigger({
          title: user.username,
          body: content,
          id: 4,
        });
        // const fromSelf = socket.id === from;
        if (user._id === to || from) {
          user.messages.push({
            to,
            content,
            from,
          });
          if (user !== this.$store.state.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
    socket.on("user connected", (id) => {
      this.$store.state.users.forEach((val) => {
        if (val._id === id) {
          val.connected = true;
        }
      });
    });
    socket.on("user disconnect", (id) => {
      this.$store.state.users.forEach((val) => {
        if (val._id === id) {
          val.connected = false;
        }
      });
    });
  },
});
</script>
<style lang="scss">
#app {
  font-family: "Jost", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
