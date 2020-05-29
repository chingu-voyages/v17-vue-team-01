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
            <br>
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox" :checked="user.emailOpt" v-on:click="changeChecked()">
              <span class="numbering">I want to receive emails</span>
              <span class="checkmark"></span>
            </label>
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
              <br>
              <span v-if="user.emailOpt">
                I want to receive emails
              </span>
              <span v-else>  
                I do NOT want to receive emails
              </span>  
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
      emailOpt: null,
      emailOptDisplay: "",
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
    this.emailOpt = this.user.emailOpt;
    if(this.emailOpt == false) this.emailOptDisplay = "";
    if(this.emailOpt == true) this.emailOptDisplay = "checked";
    this.user.events.forEach(event => {
      //axios get show route to see if user is the creator
      let route;
      process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/show/" + event._id : route = `https://chingutime.herokuapp.com/api/events/show/${event._id}`;  
      this.axios
        .get(route, {
        //.get(process.env.VUE_APP_BE_URL + "events/show/" + event._id, {
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
      let confirmation = confirm("Confirm changes?");
      if (confirmation == true) {
        if(this.email != null && this.email != "" && !this.validateEmail(this.email)){
          this.answerValidate = "Please use a valid email address.";
        } 
        else{
          let route;
          process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "users/update" : route = "https://chingutime.herokuapp.com/api/users/update";  
          this.axios
            .post(route,
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

      this.settings.emailOpt = this.emailOpt;
      console.log(this.settings.emailOpt)
      return this.settings;
    },
    savingChanges(response) {
      if (this.usertoken) {
        let route;
        process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "users/profile" : route = "https://chingutime.herokuapp.com/api/users/profile";    
        this.axios
          .get(route, {
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
