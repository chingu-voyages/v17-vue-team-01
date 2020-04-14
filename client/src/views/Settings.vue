<template>
  <v-sheet>
    <v-card class="mx-auto" max-width="400">
      <v-card-text>
        <h1>Change User Information</h1>
        <br>
        <h3>Each Field can be set individually or left empty</h3>
        <v-form ref="form" lazy-validation @submit.prevent="processForm">
          <v-text-field v-on:keyup.enter="processForm" v-model="email" :rules="[rules.emailtext]" label="E-mail" class="topMargin"></v-text-field>

          <v-text-field v-on:keyup.enter="processForm" v-model="name" label="Name"></v-text-field>

          <v-text-field v-on:keyup.enter="processForm" v-model="username" label="Username"></v-text-field>

          <v-text-field
          v-on:keyup.enter="processForm"
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            label="New Password"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>

          <v-select
          v-on:keyup.enter="processForm"
            v-model="time"
            :items="zones"
            menu-props="auto"
            label="Select"
            hide-details
            single-line
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="processForm" color="success">Update Information</v-btn>
        <v-btn to="/" color="primary">Back Home</v-btn>
      </v-card-actions>
    </v-card>
    <br>
    <v-card class="mx-auto" max-width="400" v-if="answer">
      <v-card-text>
        <h3 v-html="answer"></h3>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      show1: false,
      answer: null,
      username: null,
      password: null,
      name: null,
      email: null,
      time: null,
      rules: {
        emailtext: v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      },
      settings: {},
      zones: [
        "Select Timezone",
        "UTC +14:00 Samoa",
        "UTC +13:45	New Zealand",
        "UTC +13:00 New Zealand",
        "UTC +12:00	Fiji",
        "UTC +11:00	Australia",
        "UTC +10:30	Australia",
        "UTC +10:00	Queensland/Australia",
        "UTC +09:30	Northern Territory/Australia",
        "UTC +09:00	Japan, South Korea",
        "UTC +08:45	Western Australia",
        "UTC +08:00	China, Philippines",
        "UTC +07:00	Indonesia",
        "UTC +06:30	Myanmar",
        "UTC +06:00	Bangladesh",
        "UTC +05:45	Nepal",
        "UTC +05:30	India",
        "UTC +05:00	Pakistan",
        "UTC +04:30	Iran and Afghanistan",
        "UTC +04:00	Azerbaijan",
        "UTC +03:00	Moscow/Russia",
        "UTC +02:00	Greece",
        "UTC +01:00	Germany",
        "UTC +00:00	United Kingdom",
        "UTC -01:00	Cabo Verde",
        "UTC -02:00	Brazil",
        "UTC -02:30 Canada",
        "UTC -03:00	Brazil and Argentina",
        "UTC -04:00 USA New York",
        "UTC -05:00 USA Chicago",
        "UTC -06:00 USA Mexico City",
        "UTC -07:00 USA Los Angeles",
        "UTC -08:00 Alaska/USA",
        "UTC -09:00 Alaska/USA",
        "UTC -09:30 Marquesas Islands",
        "UTC -10:00	Hawaii/USA",
        "UTC -11:00	American Samoa",
        "UTC -12:00	US Minor Outlying Islands"
      ]
    };
  },
  mounted() {
    this.answer = `
    Email: ${this.user[0].email}  
    <br>Name: ${this.user[0].name}
    <br>Username: ${this.user[0].username}
    <br>Timezone: UTC ${this.user[0].TZ}
    `
  },
  methods: {
    processForm() {
      let confirmation = confirm("Confirm changes?");
      if (confirmation == true) {
        console.log(this.selectFields());
        this.axios
          .post(
            "https://chingutime.herokuapp.com/api/users/update",
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
          console.log("sucess");
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
      console.log("saving");

      if (this.usertoken) {
        this.axios
          .get("https://chingutime.herokuapp.com/api/users/profile", {
            headers: { "x-access-token": this.usertoken }
          })
          .then(response => this.userUpdate(response));
      }
    },
    userUpdate(response) {
      console.log("update");
      if (!_.isEqual(this.user, response.data)) {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("done");
        location.reload();
      }
    }
  }
};
</script>

<style lang="scss"></style>
