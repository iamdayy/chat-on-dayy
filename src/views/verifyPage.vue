<template>
  <v-layout>
    <v-container>
      <v-card title="Verification Account">
        <v-card-text>
          <div v-if="success">
            <p class="text-success">
              Your account is successfully activated please login to usage the
              app
            </p>
            <v-icon size="large" color="success"> mdi-check </v-icon>
            <v-btn :to="{ name: 'Login' }" variant="elevated" color="success"
              >Go to login page</v-btn
            >
          </div>
          <div v-else>
            <p class="text-error">
              Your request to activation account is failed. please try again
              later
            </p>
            <v-icon size="large" color="error"> mdi-close </v-icon>
            <!-- <v-btn variant="text" @click="">Send activation email again.</v-btn> -->
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script lang="ts">
import axiosInstance from "@/services/axios.service";
import { defineComponent } from "vue";
export default defineComponent({
  name: "verifyPage",
  data() {
    return {
      success: false,
    };
  },
  async beforeCreate() {
    // this.handleVerification();
    const response = await axiosInstance.get(
      "verify/" + this.$route.params.token
    );
    if (response.data.status) this.success = true;
  },
});
</script>
