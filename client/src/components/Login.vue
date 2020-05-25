<template>
  <v-container>
    <v-row v-if="!logging">
      <v-col>
        <v-card class="mx-auto" max-width="360">
          <v-card-text class="text-left">
            <h1>Log in</h1>
            <br>
            <input
              class="input"
              v-on:keyup.enter="getToken"
              type="text"
              name="username"
              v-model="username"
              placeholder="Username"
              maxlength="20"
            >
            <input
              class="input"
              v-on:keyup.enter="getToken"
              type="password"
              name="password"
              v-model="password"
              placeholder="Password"
              maxlength="25"
            >
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn @click="getToken" color="success">Log in</v-btn>
            <v-btn to="/register" class="leftMargin" color="primary">Register Here</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3 class="red--text">{{ answer }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <Logging v-if="logging"/>
  </v-container>
</template>

<script>
import Logging from "./Logging.vue";
export default {
  name: "Login",
  components: {
    Logging
  },
  data() {
    return {
      password: null,
      username: null,
      answer: null,
      serverResponse: null,
      logging: false
    };
  },
  mounted() {},
  watch: {},
  methods: {
    getToken() {
      this.logging = true;
      
      if (!this.username || !this.password) {
        this.answer = "Please fill out all the fields.";
        this.logging = false;
      } else {
        //prevent javascript or html injection
        this.username = this.username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let route;
        process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "users/login" : route = "https://chingutime.herokuapp.com/api/users/login";
        this.axios
          .post(route, {
            username: this.username,
            password: this.password
          })
          .then(response => this.userfoundCheck(response))
          .catch(error => (console.log(error), (this.answer = error), (this.logging = false)));
      }
    },
    userfoundCheck(response) {
      if (!response.data.token) {
        this.answer = response.data.msg;
        this.logging = false;
      } else {
        this.serverResponse = response.data.token.slice(7);
        this.tokenReceived(this.serverResponse);
      }
    },
    tokenReceived(value) {
      localStorage.setItem("usertoken", value);
      let route;
      process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "users/profile" : route = "https://chingutime.herokuapp.com/api/users/profile";  
      this.axios
        .get(route, {
        //.get(process.env.VUE_APP_BE_URL + "users/profile", {
          headers: { "x-access-token": value }
        })
        .then(
          response => (
            localStorage.setItem("user", JSON.stringify(response.data)),
            location.reload()
          )
        );
    }
  }
};
</script>

<style lang="scss">
.leftMargin {
  margin-left: 15px;
}
.input {
  color: black;
  display: block;
  border: 1px solid black;
  width: 96%;

  border-radius: 3px;
  padding: 10px 5px;
  margin: 0 0 10px 0;
  font-size: 18px;
}
</style>
