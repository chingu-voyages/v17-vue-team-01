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
              <option disabled value>Please select timezone(UTC)</option>
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
              Timezone: UTC {{time || user.TZ}}
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
        "+14:00 Samoa",
        "+13:45	New Zealand",
        "+13:00 New Zealand",
        "+12:00	Fiji",
        "+11:00	Australia",
        "+10:30	Australia",
        "+10:00	Queensland/Australia",
        "+09:30	Northern Territory/Australia",
        "+09:00	Japan, South Korea",
        "+08:45	Western Australia",
        "+08:00	China, Philippines",
        "+07:00	Indonesia",
        "+06:30	Myanmar",
        "+06:00	Bangladesh",
        "+05:45	Nepal",
        "+05:30	India",
        "+05:00	Pakistan",
        "+04:30	Iran and Afghanistan",
        "+04:00	Azerbaijan",
        "+03:00	Moscow/Russia",
        "+02:00	Greece",
        "+01:00	Germany",
        "+00:00	United Kingdom",
        "-01:00	Cabo Verde",
        "-02:00	Brazil",
        "-02:30 Canada",
        "-03:00	Brazil and Argentina",
        "-04:00 USA New York",
        "-05:00 USA Chicago",
        "-06:00 USA Mexico City",
        "-07:00 USA Los Angeles",
        "-08:00 Alaska/USA",
        "-09:00 Alaska/USA",
        "-09:30 Marquesas Islands",
        "-10:00	Hawaii/USA",
        "-11:00	American Samoa",
        "-12:00	US Minor Outlying Islands"
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
