<template>
  <v-card>
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
      <v-avatar color="primary" size="24" v-text="step"></v-avatar>
    </v-card-title>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-text-field
            label="Email"
            type="email"
            placeholder="john@google.com"
            v-model="email"
          ></v-text-field>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field
            label="Token"
            type="number"
            placeholder="0000"
            v-model="token"
          ></v-text-field>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <v-card-text>
          <v-form>
            <v-text-field v-model="username" label="Username"></v-text-field>
            <v-text-field
              v-model="newPassword"
              label="New Password"
            ></v-text-field>
            <v-text-field
              v-model="passwordConfirm"
              label="PasswordConfirm"
            ></v-text-field>
            <v-btn
              type="submit"
              block
              class="mt-2"
              @click="handleSendNewPassword"
              >Submit</v-btn
            >
          </v-form>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <div class="pa-4 text-center">
          <v-img
            class="mb-4"
            contain
            height="128"
            src="https://cdn.vuetifyjs.com/images/logos/v.svg"
          ></v-img>
          <h3 class="text-h6 font-weight-light mb-2">
            Welcome back to Chat On Dayy
          </h3>
        </div>
      </v-window-item>
    </v-window>
    <v-divider></v-divider>

    <v-card-actions>
      <v-btn v-if="step > 1" variant="text" @click="step--"> Back </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="step < 3"
        color="primary"
        variant="flat"
        :loading="loading"
        @click="next"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import axiosInstance from "@/services/axios.service";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ResetPasswordView",
  data: () => ({
    length: 3,
    step: 0,
    loading: false,
    email: "",
    token: "",
    newPassword: "",
    passwordConfirm: "",
    username: "",
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Sign-up";
        case 2:
          return "Create a password";
        default:
          return "Account created";
      }
    },
  },
  methods: {
    handleSendNewPassword() {
      const payload = {
        username: this.username,
        newPassword: this.newPassword,
        token: this.$route.params.token,
      };
      this.$store.dispatch("resetPwd", payload);
      this.step++;
    },
    async requestRecover() {
      try {
        const { data } = await axiosInstance.post("recover", this.email);
        this.loading = false;
        if (!data.status) {
          this.$store.commit("setToast", {
            visible: true,
            color: "error",
            title: data.message,
          });
          return;
        }
        this.token = data.message.token;
        this.$store.commit("setToast", {
          visible: true,
          color: "success",
          title: data.message,
        });
        this.step++;
      } catch (error) {
        this.$store.commit("setToast", {
          visible: true,
          color: "error",
          title: error,
        });
      }
    },
    async verifyToken() {
      try {
        const { data } = await axiosInstance.get("verify/token?=" + this.token);
        if (!data.status) {
          this.$store.commit("setToast", {
            visible: true,
            color: "error",
            title: data.message,
          });
          return;
        }
        this.step++;
      } catch (error) {
        this.$store.commit("setToast", {
          visible: true,
          color: "error",
          title: error,
        });
        return;
      }
    },
    next() {
      switch (this.step) {
        case 1:
          return this.requestRecover;
        case 2:
          return this.verifyToken;
        case 3:
          return this.handleSendNewPassword;
      }
    },
  },
});
</script>
