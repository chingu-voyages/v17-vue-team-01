<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="360">
          <v-card-text>
            <h1>Change User Information</h1>
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
            <select v-model="time" class="input" placeholder="Timezone" label="Timezone">
              <option disabled value>Please select timezone</option>
              <option v-for="zone in zones" v-bind:value="zone" :key="zone">{{zone}}</option>
            </select>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="processForm" color="success">Update Information</v-btn>
            <v-btn to="/" color="primary">Back Home</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3>
              Email: {{email || user.email}}
              <br>
              Name: {{name || user.name}}
              <br>
              Username: {{username || user.username}}
              <br>
              Timezone: {{time || "UTC " + user.TZ}}
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
      username: null,
      password: null,
      name: null,
      email: null,
      time: "",
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
    // this.answer = `
    // Email: ${this.user.email}  
    // <br>Name: ${this.user.name}
    // <br>Username: ${this.user.username}
    // <br>Timezone: UTC ${this.user.TZ}
    // `;
  },
  methods: {
    processForm() {
      let confirmation = confirm("Confirm changes?");
      if (confirmation == true) {
        this.axios
          .post(
            "https://chingutime.herokuapp.com/api/users/update",
            //.post("http://localhost:5000/api/users/update",
            this.selectFields(),
            {
              headers: { "x-access-token": this.usertoken }
            }
          )
          .then(
            response => (
              (this.answer = response.data.msg), this.savingChanges(response)
            )
          )
          .catch(error => (console.log(error), (this.answer = error)));
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
        console.log(`zone: ${zone}`);
      }
      if (this.name) {
        this.settings.name = this.name;
      }
      if (this.password) {
        this.settings.password = this.password;
      }
      if (this.username) {
        this.settings.username = this.username;
      }
      if (this.email) {
        this.settings.email = this.email;
      }
      return this.settings;
    },
    savingChanges(response) {
      if (this.usertoken) {
        this.axios
          .get("https://chingutime.herokuapp.com/api/users/profile", {
            //  .get("http://localhost:5000/api/users/profile", {
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
