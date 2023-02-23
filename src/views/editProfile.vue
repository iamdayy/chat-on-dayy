<template>
  <v-card>
    <v-card-title>
      <v-sheet class="mb-4">
        <div>
          <!-- slot for parent component to activate the file changer -->
          <div @click="launchFilePicker">
            <v-avatar
              size="96"
              class="mr-4"
              :image="
                $store.state.profile.avatar ||
                'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
              "
            >
            </v-avatar>
          </div>
          <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->
          <input
            type="file"
            ref="fileInput"
            :name="uploadFieldName"
            @change="onFileChange"
            :disabled="$store.state.me._id !== $store.state.profile._id"
            style="display: none"
          />
          <!-- error dialog displays any potential errors -->
          <v-dialog v-model="errorDialog" max-width="300">
            <v-card>
              <v-card-text class="subheading">{{ errorText }}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="errorDialog = false" flat>Got it!</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-sheet>
      <qrcode-vue :value="$store.state.profile._id" :size="300" level="H" />
    </v-card-title>
    <v-card-text>
      <v-text-field
        variant="solo"
        v-model="$store.state.profile.username"
        :disabled="$store.state.me._id !== $store.state.profile._id"
        label="Username"
      ></v-text-field>
      <v-text-field
        variant="solo"
        v-model="$store.state.profile.email"
        :disabled="$store.state.me._id !== $store.state.profile._id"
        label="Email"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        v-if="$store.state.me._id === $store.state.profile._id"
        :loading="$store.state.loading"
        @click.prevent="$store.dispatch('updateProfile')"
      >
        <v-icon left dark>check</v-icon>
        Save Changes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import QrcodeVue from "qrcode.vue";
import { defineComponent } from "vue";
import { convertImageToBase64 } from "@/composables/imageToBase64";
export default defineComponent({
  name: "editProfile",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      avatar: "",
      errorDialog: false,
      errorText: "",
      uploadFieldName: "file",
      maxSize: 1024,
    };
  },
  methods: {
    launchFilePicker() {
      const file: HTMLElement = this.$refs.fileInput as HTMLElement;
      file.click();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onFileChange(e: any) {
      const { maxSize } = this;
      const file = e.target.files;
      // const fieldName = e.target.name;
      let imageFile = file[0];

      //check if user actually selected a file
      if (file.length > 0) {
        let size = imageFile.size / maxSize / maxSize;
        if (!imageFile.type.match("image.*")) {
          // check whether the upload is an image
          this.errorDialog = true;
          this.errorText = "Please choose an image file";
        } else if (size > 1) {
          // check whether the size is greater than the size limit
          this.errorDialog = true;
          this.errorText =
            "Your file is too big! Please select an image under 1MB";
        } else {
          // Append file into FormData & turn file into image URL
          // let formData = new FormData();
          // let imageURL = URL.createObjectURL(imageFile);
          // formData.append(fieldName, imageFile);
          // Emit FormData & image URL to the parent component
          this.$store.state.profile.avatar = await convertImageToBase64(
            imageFile
          );
        }
      }
    },
  },
});
</script>
