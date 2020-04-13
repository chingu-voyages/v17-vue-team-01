<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="400">
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field v-model="username" label="Username" required></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="show1 ? 'text' : 'password'"
                label="Password"
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="getToken" color="success">Login</v-btn>
            <v-btn to="/register" class="leftMargin" color="primary">Register Here</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="400" v-if="answer">
          <v-card-text>
            <h3>{{ answer }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      show1: false,
      password: null,
      username: null,
      rules: {
        required: value => !!value || "Password is required"
      },
      answer: null,
      serverResponse: null
    };
  },
  mounted() {},
  watch: {},
  methods: {
    getToken() {
      if (!this.username || !this.password) {
        this.answer = "Please fill out all the fields.";
      } else {
        this.axios
          .post("https://chingutime.herokuapp.com/api/users/login", {
            username: this.username,
            password: this.password
          })
          .then(
            response => (
              (this.serverResponse = response.data.token.slice(7)),
              this.tokenReceived(this.serverResponse)
            )
          )
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    tokenReceived(value) {
      localStorage.setItem("usertoken", value);
      this.axios
        .get("https://chingutime.herokuapp.com/api/users/profile", {
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

<style lang="css">
.leftMargin {
  margin-left: 15px;
}
</style>
