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
import { user, notifications } from "./types";
import { notify, notifyMobile } from "@/services/notify.service";
import { DeviceInfo, isMobile } from "@/services/device.service";
export default defineComponent({
  components: {},
  beforeMount() {
    this.$store.dispatch("onInit");
  },
  mounted() {
    DeviceInfo();
    const notifyData: notifications = {
      title: "Welcome To chat on day",
      body: "enjoy your chat",
      id: 1,
    };
    isMobile ? notifyMobile(notifyData) : notify(notifyData);
    // socket.on("users", (users: user[]) => {
    //   store.state.users = users;
    // });
    // socket.on("userConnected", (id: string) => {
    //   store.state.users.forEach((user: user) => {
    //     if (user._id === id) user.connected = true;
    //   });
    // });
    socket.on("addFreind", (user: user) => {
      const notifyData: notifications = {
        title: user.username + "Add you to chat",
        body: "Accept now or decline",
        id: 1,
      };
      isMobile ? notifyMobile(notifyData) : notify(notifyData);
      this.$store.state.me.requestFreind.push(user);
      this.$store.commit("setToast", {
        visible: true,
        color: "success",
        title: "You have new request to freind",
      });
    });
    socket.on("requestAccepted", (user: user) => {
      this.$store.state.users.push(user);
      const indexUser = this.$store.state.me.requestFreind.indexOf(user);
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
        const notifyData: notifications = {
          title: "you have new message from " + user.username,
          body: "Check now!",
          id: 1,
        };
        // const fromSelf = socket.id === from;
        if (user._id === to || from) {
          user.messages.push({
            to,
            content,
            from,
          });
          isMobile ? notifyMobile(notifyData) : notify(notifyData);
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
