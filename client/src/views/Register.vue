<template>
  <v-container>
    <v-row v-if="!logging">
      <v-col>
        <v-card class="mx-auto" max-width="360">
          <v-card-text>
            <h1>Register</h1>
            <br>
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="text"
              name="email"
              v-model="email"
              placeholder="Email"
              maxlength="50"
            >
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="text"
              name="name"
              v-model="name"
              placeholder="Name"
              maxlength="30"
            >
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="text"
              name="username"
              v-model="username"
              placeholder="Username"
              maxlength="20"
            >
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="password"
              name="password"
              v-model="password"
              placeholder="Password"
              maxlength="25"
            >
            <select v-model="time" class="input" placeholder="Timezone" label="Timezone">
              <option disabled value>Please select timezone</option>
              <option v-for="zone in zones" v-bind:value="zone" :key="zone">{{zone}}</option>
            </select>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn @click="processForm" color="success">Create Account</v-btn>
            <v-btn to="/" class="leftMargin" color="primary">Login Here</v-btn>
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
import Logging from "../components/Logging.vue";

export default {
  name: "Register",
  components: {
    Logging
  },
  data() {
    return {
      time: "",
      logging: false,
      zones: [
        "UTC +14:00 Kiribati",
        "UTC +13:00 Samoa/Tonga",
        "UTC +12:00	Fiji/New Zealand",
        "UTC +11:00	Australia/Micronesia",
        "UTC +10:00	Queensland/Syndey Australia",
        "UTC +09:00	Japan, South Korea",
        "UTC +08:00	China, Philippines",
        "UTC +07:00	Indonesia",
        "UTC +06:00	Bangladesh",
        "UTC +05:00	Pakistan",
        "UTC +04:00	Dubai/Georgia",
        "UTC +03:00	Turkey/Iraq",
        "UTC +02:00	Germany/Austria",
        "UTC +01:00	United Kingdom/Portugal",
        "UTC +00:00	Iceland/Morocco",
        "UTC -01:00	Cabo Verde",
        "UTC -02:00	Brazil",
        "UTC -03:00	Brazil/Argentina",
        "UTC -04:00 USA New York",
        "UTC -05:00 USA Chicago",
        "UTC -06:00 USA Mexico City",
        "UTC -07:00 USA Los Angeles",
        "UTC -08:00 Alaska/USA",
        "UTC -09:00 Alaska/USA",
        "UTC -10:00	Hawaii/USA",
        "UTC -11:00	American Samoa",
        "UTC -12:00	US Minor Outlying Islands"
      ],
      password: null,
      answer: null
    };
  },
  methods: {
    processForm() {
      if (
        !this.name ||
        !this.email ||
        !this.username ||
        !this.password ||
        !this.time
      ) {
        this.answer = "Please fill out all the fields.";
      } else {
        if (!this.validateEmail(this.email)) {
          this.answer = "Please use a valid email address.";
        } else {
          //prevent javascript or html injection
          this.name = this.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          this.username = this.username
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

          let direction = this.time.slice(4, 5);
          let identifier = this.time.slice(5, 7);
          let addition = this.time.slice(8, 10);

          let zone = Number(identifier + "." + addition);
          if (direction == "-") {
            zone *= -1;
          }

          this.logging = true;

          this.axios
            .post("https://chingutime.herokuapp.com/api/users/register", {
            //.post(process.env.VUE_APP_BE_URL + "users/register", {
              name: this.name,
              email: this.email,
              username: this.username,
              password: this.password,
              confirm_password: this.password,
              TZ: zone
            })
            .then(response => {
              this.answer = response.data.msg;
              this.logging = false;
            })
            .catch(error => {
              console.log(error);
              this.answer = error;
              this.logging = false;
            });
        }
      }
    },
    validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
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
