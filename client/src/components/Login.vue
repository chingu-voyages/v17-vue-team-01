<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="360">
          <v-card-text class="text-left">
            <h1>Login</h1>
            <br>
            <input
              class="input"
              v-on:keyup.enter="getToken"
              type="text"
              name="username"
              v-model="username"
              placeholder="Username"
            >
            <input
              class="input"
              v-on:keyup.enter="getToken"
              type="password"
              name="password"
              v-model="password"
              placeholder="Password"
            >
          </v-card-text>
          <v-card-actions>
            <v-btn @click="getToken" color="success">Login</v-btn>
            <v-btn to="/register" class="leftMargin" color="primary">Register Here</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3>{{ answer }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

      <v-row 
      v-if="logging"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="subtitle-1 text-center"
          cols="12"
        >
          Logging in...
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="green accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>

  </v-container>
</template>

<script>
export default {
  name: "Login",
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
      let logging = !logging;
      if (!this.username || !this.password) {
        this.answer = "Please fill out all the fields.";
      } else {
        this.axios
          .post("https://chingutime.herokuapp.com/api/users/login", {
           // .post("http://localhost:5000/api/users/login", {
            username: this.username,
            password: this.password
          })
          .then(response => this.userfoundCheck(response))
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    userfoundCheck(response) {
      if (!response.data.token) {
        this.answer = response.data.msg;
      } else {
        this.serverResponse = response.data.token.slice(7);
        this.tokenReceived(this.serverResponse);
      }
    },
    tokenReceived(value) {
      localStorage.setItem("usertoken", value);
      this.axios
        .get("https://chingutime.herokuapp.com/api/users/profile", {
          //.get("http://localhost:5000/api/users/profile", {
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
