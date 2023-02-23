<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-list lines="one">
        <v-list-item v-for="(message, index) in messages" :key="index"
          ><v-list-item-title
            :class="
              message.to !== user._id
                ? 'text-start'
                : message.from === user._id
                ? 'text-start'
                : 'text-end'
            "
            >{{ message.content }}</v-list-item-title
          ></v-list-item
        >
      </v-list>
      <v-sheet>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="message"
              append-icon="mdi-send"
              variant="filled"
              clear-icon="mdi-close-circle"
              clearable
              label="Message"
              type="text"
              @keyup.enter="onMessage"
              @click:append="onMessage"
              @click:clear="message = ''"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import io from "@/services/socketio.service";
import { store } from "@/store";
import type { user, message } from "@/types";
export default defineComponent({
  name: "UserChatPage",
  data() {
    return {
      message: "",
    };
  },
  computed: {
    user(): user {
      return store.state.selectedUser;
    },
    messages(): message[] {
      return store.getters.getMessages;
    },
  },
  methods: {
    onMessage() {
      if (!this.message) return;
      if (this.user) {
        io.emit("private message", {
          content: this.message,
          to: this.user._id,
        });
        const user = store.state.selectedUser;
        user?.messages.push({
          to: this.user._id,
          content: this.message,
          from: store.state.me._id,
        });
      }
      this.message = "";
    },
  },
});
</script>
