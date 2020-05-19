<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="360">
          <v-card-text>
            <h1>Change Your Info</h1>
            <br>
            <h3>Each Field can be set individually or left empty</h3>
            <br>
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="text"
              name="email"
              v-model="email"
              placeholder="Email"
            >
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="text"
              name="name"
              v-model="name"
              placeholder="Name"
            >
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="text"
              name="username"
              v-model="username"
              placeholder="Username"
            >
            <input
              class="input"
              v-on:keyup.enter="processForm"
              type="password"
              name="password"
              v-model="password"
              placeholder=" New Password"
            >
            <select v-model="time" class="input" placeholder="Timezone" label="Timezone" v-if="canChangeTZ">
              <option disabled value>Please select timezone</option>
              <option v-for="zone in zones" v-bind:value="zone" :key="zone">{{zone}}</option>
            </select>
            <p v-else style="margin-bottom: 0px;">You are the creator of pending events, you cannot change your timezone right now</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn @click="processForm" color="success">Update Info</v-btn>
            <v-btn to="/" color="primary">Back Home</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3 class="red--text">{{ answerValidate }}</h3>
            <br v-if="answerValidate">
            <h2>Here is your current info:</h2>
            <br>
            <h3>
              Email: {{user.email}}
              <br>
              Name: {{user.name}}
              <br>
              Username: {{user.username}}
              <br>
              Timezone: {{"UTC " + user.TZ}}
            </h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      answer: true,
      answerValidate: "",
      username: null,
      password: null,
      name: null,
      email: null,
      time: "",
      canChangeTZ: true,
      settings: {},
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
      ]
    };
  },
  mounted() {
    this.user.events.forEach(event => {
      //axios get show route to see if user is the creator
      this.axios
        .get(`https://chingutime.herokuapp.com/api/events/show/${event._id}` || `${process.env.VUE_APP_BE_URL}/events/show/${this.url}`, {
        //.get(process.env.VUE_APP_BE_URL + "events/show/" + this.url, {
          headers: {
            "x-access-token": localStorage
              .getItem("usertoken")
              .replace(/"/g, "")
          }
        })
        .then(response => {
          if(response.data[0].users[0].username == this.user.username && response.data[0].scheduled == false) {
            this.canChangeTZ = false; 
            return;
          }
        }) //(this.event = response.data))
        .catch(error => (console.log(error), (this.answer = error)));
      //if(event.scheduled == false) this.canChangeTZ = false;
      //return;
    });
  },
  methods: {
    processForm() {
      let confirmation = confirm("Confirm changes?");
      if (confirmation == true) {
        if(this.email != null && this.email != "" && !this.validateEmail(this.email)){
          this.answerValidate = "Please use a valid email address.";
        } 
        else{
          this.axios
            .post("https://chingutime.herokuapp.com/api/users/update" || `${process.env.VUE_APP_BE_URL}/users/update`,
            //.post(process.env.VUE_APP_BE_URL + "users/update",
              this.selectFields(),
              {
                headers: { "x-access-token": this.usertoken }
              }
            )
            .then(
              response => (
                (this.answer = response.data.msg), (this.answerValidate = response.data.msg), this.savingChanges(response)
              )
            )
            .catch(error => (console.log(error), (this.answer = error)));
        }
      }
    },
    selectFields() {
      if (this.time) {
        let direction = this.time.slice(4, 5);
        let identifier = this.time.slice(5, 7);
        let addition = this.time.slice(8, 10);
        let zone = Number(identifier + "." + addition);
        if (direction == "-") {
          zone *= -1;
        }
        this.settings.TZ = zone;
      }
      if (this.name) {
        this.settings.name = this.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //prevent javascript or html injection
      }
      if (this.password) {
        this.settings.password = this.password;
      }
      if (this.username && this.username != "") {
        this.settings.username = this.username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //prevent javascript or html injection
      }
      else{
        this.settings.username = null
      }
      
      if (this.email && this.email != "") {
        this.settings.email = this.email;
      }
      else{
        this.settings.email = null
      }
      return this.settings;
    },
    savingChanges(response) {
      if (this.usertoken) {
        this.axios
          .get("https://chingutime.herokuapp.com/api/users/profile" || `${process.env.VUE_APP_BE_URL}/users/profile`, {
          //.get(process.env.VUE_APP_BE_URL + "users/profile", {
            headers: { "x-access-token": this.usertoken }
          })
          .then(response => this.userUpdate(response));
      }
    },
    userUpdate(response) {
      if (!_.isEqual(this.user, response.data)) {
        localStorage.setItem("user", JSON.stringify(response.data));
        location.reload();
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
