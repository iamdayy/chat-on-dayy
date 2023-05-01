<template>
  <div class="cont">
    <div class="main">
      <input type="checkbox" id="chk" aria-hidden="true" />

      <div class="signup">
        <form>
          <label class="hdr" for="chk" aria-hidden="true">Sign up</label>
          <v-sheet width="300" class="mx-auto">
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
              ></v-text-field>
              <v-text-field
                v-model="email"
                :rules="usernameRules"
                label="Email"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
              ></v-text-field>
              <v-btn type="submit" block class="mt-2">Submit</v-btn>
            </v-form>
          </v-sheet>
        </form>
      </div>

      <div class="login">
        <form>
          <label class="hdr" for="chk" aria-hidden="true">Login</label>
          <v-sheet width="300" class="mx-auto">
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
              ></v-text-field>
              <v-btn variant="plain" to="/recover">Forgot Password?</v-btn>
              <v-btn type="submit" block class="mt-2">Login</v-btn>
            </v-form>
          </v-sheet>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { store } from "@/store";
export default defineComponent({
  name: "authPage",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      email: "",
      usernameRules: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (value: any) => {
          if (value) return true;

          return "You must enter a username.";
        },
      ],
      passwordRules: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (value: any) => {
          if (value) return true;

          return "You must enter a password.";
        },
      ],
    };
  },
  methods: {
    handleLogin() {
      const formData = {
        username: this.username,
        password: this.password,
      };
      store.dispatch("login", formData);
    },
    handleRegister() {
      const formData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };
      store.dispatch("register", formData);
    },
  },
});
</script>
<style scoped>
.main {
  width: 350px;
  height: 500px;
  overflow: hidden;
  background: #573b8a;
  /* background: url("https://doc-08-2c-docs.googleusercontent.com/docs/securesc/68c90smiglihng9534mvqmq1946dmis5/fo0picsp1nhiucmc0l25s29respgpr4j/1631524275000/03522360960922298374/03522360960922298374/1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0&nonce=gcrocepgbb17m&user=03522360960922298374&hash=tfhgbs86ka6divo3llbvp93mg4csvb38")
    no-repeat center/ cover; */
  border-radius: 10px;
  box-shadow: 5px 20px 50px #000;
}
.cont {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
#chk {
  display: none;
}
.signup {
  position: relative;
  background: #fff;
  border-radius: 60% / 10%;
  width: 100%;
  height: 100%;
  transition: 0.8s ease-in-out;
}
.hdr {
  color: #573b8a;
  font-size: 2.3em;
  justify-content: center;
  display: flex;
  margin: 60px;
  margin-bottom: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.5s ease-in-out;
}
.login {
  height: 460px;
  background: #573b8a;
  border-radius: 60% / 10%;
  transform: translateY(-190px);
  transition: 0.8s ease-in-out;
}
.login .hdr {
  color: #fff;
  transform: scale(0.6);
}

#chk:checked ~ .login {
  background: #fff;
  transform: translateY(-500px);
}
#chk:checked ~ .signup {
  background: #573b8a;
}
#chk:checked ~ .login .hdr {
  color: #573b8a;
  transform: scale(1);
}
#chk:checked ~ .signup .hdr {
  color: #fff;
  transform: scale(0.6);
}
</style>
