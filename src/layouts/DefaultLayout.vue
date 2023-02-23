<template>
  <v-layout>
    <v-app-bar
      v-if="$route.path === '/chat'"
      :title="userSelected.username"
      color="indigo-darken-3"
      @click="$router.push('/profile')"
    >
      <template v-slot:prepend>
        <v-avatar
          :image="
            userSelected.avatar ||
            'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
          "
          @click.stop="drawer = !drawer"
        />
      </template>
    </v-app-bar>
    <v-app-bar v-else :title="me.username" color="indigo-darken-3">
      <template v-slot:prepend>
        <v-avatar
          :image="
            me.avatar ||
            'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
          "
          @click.stop="drawer = !drawer"
        />
      </template>
      <v-spacer></v-spacer>
      <v-btn @click="rightDrawer = true" icon>
        <v-icon>mdi-account-circle</v-icon></v-btn
      >
      <v-btn icon v-if="isMobile" @click="startScan">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-dialog v-else v-model="dialog" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="scan">Scan</v-tab>
            <!-- <v-tab value="upload">Upload</v-tab> -->
          </v-tabs>
          <v-card-text>
            <addFreind :tab-props="tab" @decode="dialog = false" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-if="$route.path === '/chat'"
          :prepend-avatar="
            userSelected.avatar ||
            'https://randomuser.me/api/portraits/men/85.jpg'
          "
          :title="userSelected.username"
          nav
        >
          <template v-slot:append>
            <v-btn variant="text" @click.stop="drawer = !drawer">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </template>
        </v-list-item>
        <v-list-item
          v-else
          :prepend-avatar="
            me.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'
          "
          :title="me.username"
          nav
        >
          <template v-slot:append>
            <v-btn variant="text" @click.stop="drawer = !drawer">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list v-if="$route.path === '/chat'" density="compact" nav>
        <router-link
          v-for="(list, index) in items"
          :key="index"
          :to="list.to"
          class="text-decoration-none"
        >
          <v-list-item
            :prepend-icon="list.icon"
            :title="list.title"
            value="home"
          ></v-list-item>
        </router-link>
      </v-list>
      <v-list v-else density="compact" nav>
        <router-link
          v-for="(list, index) in items"
          :key="index"
          :to="list.to"
          class="text-decoration-none"
        >
          <v-list-item
            :prepend-icon="list.icon"
            :title="list.title"
            value="home"
          ></v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-model="rightDrawer" temporary location="right">
      <v-list density="compact">
        <v-list-item
          v-for="(user, index) in me.requestFreind"
          :key="index"
          :prepend-icon="user.avatar || 'mdi-account-circle'"
          :title="user.username"
          value="home"
          ><v-list-item-subtitle
            ><v-btn @click="addFreind(user._id)"
              >Accept</v-btn
            ></v-list-item-subtitle
          ></v-list-item
        >
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { store } from "@/store";
import { isMobile } from "@/services/device.service";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { socket } from "@/services/socketio.service";
import addFreind from "@/components/addFreind.vue";
export default defineComponent({
  name: "DefaultLayout",
  components: {
    addFreind,
  },
  data() {
    return {
      tab: "",
      qr: "",
      isMobile,
      dialog: false,
      drawer: false,
      rightDrawer: false,
      items: [
        { title: "Home", icon: "mdi-home-city", to: "/" },
        { title: "My Account", icon: "mdi-account", to: "/profile" },
        { title: "Users", icon: "mdi-account-group-outline", to: "/" },
      ],
      rail: true,
    };
  },
  computed: {
    me() {
      return store.state.me;
    },
    userSelected() {
      return store.state.selectedUser;
    },
  },
  methods: {
    addFreind(v: string) {
      socket.emit("requestAccepted", v);
    },
    async startScan() {
      await BarcodeScanner.checkPermission({ force: true });
      // make background of WebView transparent
      // note: if you are using ionic this might not be enough, check below
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

      // if the result has content
      if (result.hasContent) {
        socket.emit("addFreind", result.content); // log the raw scanned content
      }
    },
    // async onDetect(
    //   promise: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   | PromiseLike<{ content: any; location: any }>
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     | { content: any; location: any }
    // ) {
    //   try {
    //     const {
    //       content, // decoded String
    //       location, // QR code coordinates
    //     } = await promise;
    //     console.log({ content, location });

    //     // ...
    //   } catch (error) {
    //     // ...
    //     console.log(error);
    //   }
    // },
  },
});
</script>
