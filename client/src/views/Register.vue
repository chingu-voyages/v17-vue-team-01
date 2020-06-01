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


            <label class="checkbox-label">
              <input type="checkbox" class="checkbox" :checked="emailOpt" v-on:click="changeChecked()">
              <span class="numbering">I want to receive emails</span>
              <span class="checkmark"></span>
            </label>


          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn @click="processForm" color="success">Create Account</v-btn>
            <v-btn to="/" class="leftMargin" color="primary">Login Here</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3 v-bind:class="{ 'green--text': success  }" class="red--text">{{ answer }}</h3>
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
      answer: null,
      success: false,
      emailOpt: true,
      emailOptDisplay: "checked",
    };
  },
  methods: {
    changeChecked() {
      if(this.emailOptDisplay == ""){
        this.emailOptDisplay = "checked";
        this.emailOpt = true;
        return;
      }
      if(this.emailOptDisplay == "checked"){
        this.emailOptDisplay = "";
        this.emailOpt = false;
        return;
      } 
    },

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
          let route;
          process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "users/register" : route = "https://chingutime.herokuapp.com/api/users/register";    
          this.axios
            .post(route, {
            //.post(process.env.VUE_APP_BE_URL + "users/register", {
              name: this.name,
              email: this.email,
              username: this.username,
              password: this.password,
              //confirm_password: this.password,
              emailOpt: this.emailOpt,
              TZ: zone
            })
            .then(response => {
              this.answer = response.data.msg;
              this.success = response.data.success;
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

//-----------------------------------------

/* The checkbox-label */
.checkbox-label {
  display: block;
  position: relative;
  padding: 1px 0 0 30px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.checkbox-label:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.checkbox-label input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-label input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-label .checkmark:after {
  left: 9px;
  top: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
