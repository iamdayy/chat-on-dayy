import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import authPage from "@/views/authPage.vue";
import verifyPage from "@/views/verifyPage.vue";
import recoverPage from "@/views/recoverPage.vue";
import AllUsers from "@/views/AllUsers.vue";
import UserChat from "@/views/UserChat.vue";
import editProfile from "@/views/editProfile.vue";
import viewProfile from "@/views/viewProfile.vue";
import { store } from "@/store";
import { nextTick } from "vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    meta: {
      requiresAuth: true,
    },
    component: DefaultLayout,
    children: [
      {
        path: "/",
        redirect: "/messages",
      },
      {
        path: "messages",
        component: AllUsers,
        meta: {
          title: "Messages",
        },
      },
      {
        path: "profile",
        component: editProfile,
        meta: {
          title: "Profile",
        },
      },
      {
        path: "view-profile",
        component: viewProfile,
        meta: {
          title: "Profile",
        },
      },
      {
        path: "chat",
        component: UserChat,
      },
    ],
  },
  {
    path: "/auth",
    name: "auth",
    component: authPage,
  },
  {
    path: "/verify/:token",
    name: "Verify",
    component: verifyPage,
  },
  {
    path: "/recover",
    name: "Recover",
    component: recoverPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = store.state.loggedIn;
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    next({ name: "auth" });
  } else if (to.path === "/auth" && isLoggedIn) {
    next({ path: "/" });
  } else {
    next();
  }
});
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    document.title = (to.meta.title as string) || "Chat On Dayy";
  });
});

export default router;
