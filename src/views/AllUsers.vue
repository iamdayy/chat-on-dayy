<template>
  <v-list>
    <v-list-item
      v-for="user in users"
      :key="user._id"
      :prepend-avatar="
        user.avatar || 'https://cdn.vuetifyjs.com/images/john.png'
      "
      :title="user.username"
      @click="toChat(user)"
    >
      <v-list-item-subtitle>
        <v-icon :color="user.connected ? 'success' : 'error'">mdi-circle</v-icon
        >{{ user.connected ? "Online" : "Offline" }}</v-list-item-subtitle
      ></v-list-item
    >
  </v-list>
</template>

<script lang="ts">
import { store } from "@/store";
import { defineComponent } from "vue";
import type { user } from "@/types";
export default defineComponent({
  name: "AllUsersPage",
  computed: {
    users(): user[] {
      return store.state.users?.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    },
  },
  methods: {
    toChat(user: user) {
      store.state.selectedUser = user;
      this.$router.push("/chat");
    },
  },
});
</script>
