<template>
  <VLayout>
    <VAppBar
      v-if="$route.path === '/chat'"
      :title="userSelected.username"
      color="indigo-darken-3"
      @click="$router.push('/profile')"
    >
      <template v-slot:prepend>
        <VAvatar
          :image="
            userSelected.avatar ||
            'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
          "
          @click.stop="drawer = !drawer"
        />
      </template>
    </VAppBar>
    <VAppBar v-else :title="me.username" color="indigo-darken-3">
      <template v-slot:prepend>
        <VAvatar
          :image="
            me.avatar ||
            'https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
          "
          @click.stop="drawer = !drawer"
        />
      </template>
      <VSpacer></VSpacer>
      <VBtn @click="rightDrawer = true" icon>
        <VIcon>mdi-account-circle</VIcon></VBtn
      >
      <VDialog v-model="dialog" width="auto">
        <template v-slot:activator="{ props }">
          <VBtn icon v-bind="props">
            <VIcon>mdi-magnify</VIcon>
          </VBtn>
        </template>

        <VCard max-width="900">
          <v-card-title>Search new Freinds</v-card-title>
          <v-container fluid>
            <v-row dense>
              <v-col cols="12">
                <VCardText>
                  <VTextField
                    :loading="loading"
                    variant="solo"
                    label="Search with username"
                    prepend-icon="mdi-qrcode-scan"
                    append-inner-icon="mdi-magnify"
                    single-line
                    hide-details
                    v-model="search"
                    @keyup.enter="onClick"
                    @click:append-inner="onClick"
                    @click:prepend="startScan"
                  />
                  <v-list v-model:opened="showExpand">
                    <v-list-group value="Users">
                      <template v-slot:activator="{ props }">
                        <v-list-item
                          v-bind="props"
                          :prepend-avatar="loaded.avatar"
                          :title="loaded.username"
                          :subtitle="loaded.email"
                        ></v-list-item>
                      </template>
                      <v-list-item>
                        <v-btn color="success" @click="openProfile"
                          >Open profile</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="requestFreind"
                          >Add Freind</v-btn
                        >
                      </v-list-item>
                    </v-list-group>
                  </v-list>
                </VCardText>
              </v-col>
            </v-row>
          </v-container>
          <VCardActions>
            <VBtn color="primary" block @click="dialog = false">Close</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VAppBar>
    <VNavigationDrawer v-model="drawer" temporary>
      <VList>
        <VListItem
          v-if="$route.path === '/chat'"
          :prepend-avatar="
            userSelected.avatar ||
            'https://randomuser.me/api/portraits/men/85.jpg'
          "
          :title="userSelected.username"
          nav
        >
          <template v-slot:append>
            <VBtn variant="text" @click.stop="drawer = !drawer">
              <VIcon>mdi-chevron-left</VIcon>
            </VBtn>
          </template>
        </VListItem>
        <VListItem
          v-else
          :prepend-avatar="
            me.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'
          "
          :title="me.username"
          nav
        >
          <template v-slot:append>
            <VBtn variant="text" @click.stop="drawer = !drawer">
              <VIcon>mdi-chevron-left</VIcon>
            </VBtn>
          </template>
        </VListItem>
      </VList>

      <VDivider></VDivider>

      <VList v-if="$route.path === '/chat'" density="compact" nav>
        <RouterLink
          v-for="(list, index) in items"
          :key="index"
          :to="list.to"
          class="text-decoration-none"
        >
          <VListItem
            :prepend-icon="list.icon"
            :title="list.title"
            value="home"
          ></VListItem>
        </RouterLink>
      </VList>
      <VList v-else density="compact" nav>
        <RouterLink
          v-for="(list, index) in items"
          :key="index"
          :to="list.to"
          class="text-decoration-none"
        >
          <VListItem
            :prepend-icon="list.icon"
            :title="list.title"
            value="home"
          ></VListItem>
        </RouterLink>
      </VList>
    </VNavigationDrawer>
    <VNavigationDrawer v-model="rightDrawer" temporary location="right">
      <VList density="compact">
        <VListItem
          v-for="(user, index) in me.requestFreind"
          :key="index"
          :prepend-icon="user.avatar || 'mdi-account-circle'"
          :title="user.username"
          value="home"
          ><VListItemSubtitle
            ><VBtn @click="addFreind(user._id)">Accept</VBtn></VListItemSubtitle
          ></VListItem
        >
      </VList>
    </VNavigationDrawer>
    <VMain>
      <RouterView />
    </VMain>
  </VLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { store } from "@/store";
import { isMobile } from "@/services/device.service";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { socket } from "@/services/socketio.service";
import { user } from "@/types";
// import addFreind from "@/components/addFreind.vue";
export default defineComponent({
  name: "DefaultLayout",
  components: {},
  data() {
    return {
      showExpand: [""],
      tab: "",
      qr: "",
      search: "",
      loading: false,
      loaded: {} as user,
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
    requestFreind() {
      socket.emit("addFreind", this.loaded);
      this.$emit("decode");
      store.commit("setToast", {
        visible: true,
        color: "success",
        title: "Request adding freind success, wait to accepted",
      });
    },
    addFreind(v: string) {
      socket.emit("requestAccepted", v);
      store.commit("setToast", {
        visible: true,
        color: "success",
        title: "New freind was Accepted, enjoy your chatting with new freind",
      });
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
    async onClick() {
      this.loading = true;
      try {
        const user = await this.$store.dispatch("getUser", {
          username: this.search,
        });
        if (!user.status) {
          this.loading = false;
          this.$store.commit("setToast", {
            visible: true,
            color: "error",
            title: user.message,
          });
        } else {
          this.loading = false;
          this.loaded = user.user;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        this.loading = false;
        this.$store.commit("setToast", {
          visible: true,
          color: "error",
          title: error.message,
        });
      }
    },
    openProfile() {
      this.$store.state.selectedUser = this.loaded;
      this.$router.push("/profile");
    },
  },
});
</script>
