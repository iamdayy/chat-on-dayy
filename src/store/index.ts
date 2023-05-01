import { createStore } from "vuex";
import { socket } from "@/services/socketio.service";
import axios from "@/services/axios.service";
import router from "@/router";
import { toast, user } from "@/types";

export const store = createStore<State>({
  state: {
    loggedIn: false,
    loading: false,
    me: {} as user,
    users: [] as user[],
    toast: {} as toast,
    modal: null,
    profile: {} as user,
    selectedUser: {} as user,
    jwt: "" as string | null,
    refresh_token: "" as string | null,
  },
  getters: {
    setLoading(state) {
      state.loading = !state.loading;
    },
    getUsers(state) {
      if (!state.users) return null;
      return state.users;
    },
    getSelectedUser(state, payload) {
      if (!payload) return null;
      return state.users.find(
        (user: { userID: string }) => user.userID === payload
      );
    },
    getMessages(state) {
      if (!state.selectedUser) return null;
      const user = state.users.find(
        (user: user) => user._id === state.selectedUser._id
      );
      const messages = user?.messages.filter(
        (message) =>
          message.from === state.selectedUser._id ||
          (state.me._id && message.to === state.selectedUser._id) ||
          state.me._id
      );
      return messages;
    },
  },
  mutations: {
    setModal(state, payload) {
      state.modal = payload;
    },
    setUsers(state, payload) {
      state.users = payload;
    },
    loggedIn(state, payload) {
      state.loggedIn = true;
      if (payload) {
        state.jwt = payload.token;
        state.refresh_token = payload.refresh_token;
        localStorage.setItem("refresh_token", payload.refresh_token);
      }
    },
    setJWTToken(state, payload) {
      const token = localStorage.getItem("token");
      if (payload) {
        localStorage.setItem("token", payload);
        state.jwt = payload;
      } else {
        state.jwt = token;
      }
    },
    setRefreshToken(state, payload) {
      const token = localStorage.getItem("Refresh_token");
      if (payload) {
        localStorage.setItem("Refresh_token", payload);
        state.refresh_token = payload;
      } else {
        state.refresh_token = token;
      }
    },
    setProfile(state, payload) {
      state.profile = payload;
    },
    setMe(state, payload) {
      state.me = payload;
    },
    setToast(state, payload) {
      state.toast = payload;
    },
  },
  actions: {
    connectIO(context, payload) {
      const sessionID = payload._id;
      const username = payload.username;
      if (sessionID) {
        socket.auth = { sessionID, username };
        socket.connect();
        console.log("Socket has connect");
      }
    },
    async onInit(context) {
      context.commit("setJWTToken", null);
      context.commit("setRefreshToken", null);
      context.dispatch("checkSignIn");
    },
    async checkSignIn(context) {
      const session = localStorage.getItem("refresh_token");
      if (session) {
        try {
          const { data } = await axios.get("/checkSignIn");
          if (data.status) {
            context.commit("setMe", data.user);
            context.commit("setProfile", data.user);
            context.dispatch("connectIO", data.user);
            context.commit("setUsers", data.user.freinds);
            context.commit("loggedIn");
            router.push("/");
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    async login(context, payload) {
      try {
        const { data } = await axios.post("/login", payload);
        if (!data.status) {
          return context.commit("setToast", {
            visible: true,
            color: "error",
            title: "Loggin Failed, please try again",
          });
        }
        context.commit("loggedIn", data);
        context.commit("setMe", data.user);
        context.commit("setProfile", data.user);
        context.commit("setJWTToken", data.token);
        context.commit("setRefreshToken", data.refresh_token);
        context.dispatch("connectIO", data.user);
        context.commit("setToast", {
          visible: true,
          color: "success",
          title: "You are logined, enjoy your chat",
        });
        router.push("/");
      } catch (error) {
        context.commit("setToast", {
          visible: true,
          color: "error",
          title: "Loggin Failed, please try again",
        });
      }
    },
    async register(context, payload) {
      try {
        const user = await axios.post("/register", payload);
        if (!user.data.success) {
          context.commit("setToast", {
            visible: true,
            color: "error",
            title: "Register failed, please try again later",
          });
        } else {
          context.commit("setToast", {
            visible: true,
            color: "success",
            title: "Register success, then login to access the chat",
          });
        }
      } catch (error) {
        context.commit("setToast", {
          visible: true,
          color: "error",
          title: "Register failed, please try again later",
        });
      }
    },
    async resetPwd(context, payload) {
      try {
        const { data } = await axios.post("reset/" + payload.token, payload);
        if (!data.status) {
          context.commit("addToast", {
            type: "error",
            message: data.response,
          });
        }
        context.commit("addToast", {
          type: "success",
          message: data.response,
        });
      } catch (error) {
        context.commit("addToast", {
          type: "error",
          message: error,
        });
      }
    },
    async getProfile(context) {
      try {
        const profile = await axios.get(
          "/getuser/" + context.state.selectedUser._id
        );
        if (!profile) return;
        context.commit("setProfile", profile.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getUser(context, payload) {
      try {
        const user = await axios.post("/getuser", payload);
        if (!user.data.status) {
          return {
            status: false,
            message: user.data.message,
          };
        } else {
          return {
            status: true,
            user: user.data.usr as user,
          };
        }
      } catch (error) {
        throw { status: false, user: null };
      }
    },
    async updateProfile(context) {
      context.commit("setLoading");
      try {
        const profile = await axios.post("/updateMe", context.state.profile);
        context.commit("setLoading");
        if (!profile.data.status) {
          context.commit("setToast", {
            visible: true,
            color: "error",
            title: "Update Profile failed, please try again later",
          });
        } else {
          context.commit("setToast", {
            visible: true,
            color: "success",
            title: "Update Profile Succes",
          });
        }
      } catch (error) {
        context.commit("setToast", {
          visible: true,
          color: "error",
          title: "Update Profile failed, please try again later",
        });
      }
    },
    async addFreind(context, payload) {
      try {
        const response = await axios.post("/addFreind", payload);
        if (!response.data.status) {
          context.commit("setToast", {
            visible: true,
            color: "error",
            title: "Adding freind failed, please try again",
          });
        } else {
          context.commit("setToast", {
            visible: true,
            color: "success",
            title: "Adding freind success, enjoy your chatting with new freind",
          });
          context.commit("setLoading");
          socket.emit("requestAccepted", payload);
        }
      } catch (error) {
        context.commit("setToast", {
          visible: true,
          color: "error",
          title: "Adding freind failed, please try again",
        });
      }
    },
  },
  modules: {},
});

export type State = {
  loggedIn: boolean;
  toast: toast;
  modal: string | null;
  loading: boolean;
  me: user;
  users: user[];
  profile: user;
  jwt: string | null;
  selectedUser: user;
  refresh_token: string | null;
};
