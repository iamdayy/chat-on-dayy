<template>
  <v-img
    class=""
    height="200px"
    src="http://unblast.com/wp-content/uploads/2021/09/Real-Estate-Agent-Illustration.jpg"
    gradient="150deg, rgb(185 224 255 / 58%) 0%, rgb(243 220 246 / 52%) 35%, rgb(223 255 242 / 74%) 74%"
  >
  </v-img>
  <v-row justify="center">
    <v-col
      align-self="start"
      class="d-flex justify-center align-center pa-0"
      cols="12"
    >
      <v-avatar
        class="profile avatar-center-heigth avatar-shadow"
        color="grey"
        size="164"
      >
        <v-btn class="upload-btn" x-large icon>
          <v-icon> mdi-camera </v-icon>
        </v-btn>
        <input ref="uploader" class="d-none" type="file" accept="image/*" />
        <v-img
          src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
        ></v-img>
      </v-avatar>
    </v-col>
  </v-row>
  <v-list-item color="#0000" class="profile-text-name ma-4 pt-16">
    <v-list-item-title class="text-h6"> Marcus Obrien </v-list-item-title>
    <v-list-item-subtitle>Network Engineer</v-list-item-subtitle>
    <v-list-item-action>
      <v-btn class="mx-2" fab dark color="indigo" small>
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>

  <v-card-subtitle>
    <b class="ml-2">Sobre Mim</b>
    <v-btn icon>
      <v-icon small> bioIcon </v-icon>
    </v-btn>
  </v-card-subtitle>

  <p v-if="!editBio" class="pl-6 pr-6 pt-0">
    {{ Bio }}
  </p>
  <v-textarea
    v-model="Bio"
    rows="2"
    v-if="editBio"
    label="Editar minha Bio"
    class="pa-6"
  ></v-textarea>
  <v-spacer></v-spacer>
  <v-text-field
    class="pa-6"
    prepend-icon="mdi-whatsapp"
    label="Phone"
    :disabled="!editBio"
  ></v-text-field>
  <v-spacer></v-spacer>

  <v-row>
    <v-col cols="6" class="text-end">
      <v-list-item-title class="text-h6"> 1002 </v-list-item-title>
      <v-list-item-subtitle class="text-caption">Curtidas</v-list-item-subtitle>
    </v-col>
    <v-col cols="6" class="text-start">
      <v-list-item-title class="text-h6"> 10 </v-list-item-title>
      <v-list-item-subtitle class="text-caption">Seguindo</v-list-item-subtitle>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "viewProfile",
  data() {
    return {
      Bio: "",
      editBio: false,
    };
  },
});
</script>
