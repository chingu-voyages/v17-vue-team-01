<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card v-if="eventPart" class="mx-auto" max-width="360">
            <h1 class="leftMargin">Event Actions</h1>
            <p class="leftMargin" v-if="user.username == eventPart.users[0].username"> You are the event creator </p>
            <v-divider></v-divider>
            <v-card-text>   
              <input
                class="input"
                v-on:keyup.enter="addUser"
                type="text"
                name="username"
                v-model="username"
                placeholder="Username"
              >
            </v-card-text>
            <v-card-actions class="justify-center topNegativeMargin">
              <v-btn @click="addUser" class="center" color="success">Add user</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-text>   
              <v-date-picker no-title v-model="dates" min=eventPart.></v-date-picker>
            <br>
            <br>
            <input
              class="input"
              type="text"
              name="Date"
              v-model="dateText"
              label="Date"
              disabled
            >
            </v-card-text>
            <v-card-actions class="justify-center topNegativeMargin">
              <v-btn @click="schedule" class="center" color="primary">Schedule Event</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-text v-if="user.username == eventPart.users[0].username && eventPart.users.length > 1"> 
                <select v-model="userDelete" class="input" placeholder="Users" label="Users">
                <option disabled value>Please select User</option>
                <option v-for="userDel in eventPart.users.slice(1)" :value="userDel.username" :key="userDel">{{userDel.username}}</option>
                </select>
            </v-card-text> 
            <v-card-actions class="justify-center topNegativeMargin" v-if="user.username == eventPart.users[0].username && eventPart.users.length > 1">
              <v-btn @click="removeUser" class="center" color="warning">Remove user</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-actions class="justify-center" v-if="user.username == eventPart.users[0].username">
                <v-btn @click="deleteEvent" class="center" color="red darken-4">Delete Event</v-btn>
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
  </v-container>
</template>

<script>
export default {
  name: "ActionsEvent",
  props: {
    eventPart: Object,
    url: String,
  },
  data() {
    return {
      username: null,
      answer: null,
      userDelete: "",
    };
  },
  mounted() {},
  watch: {},
  methods: {
    addUser() {
      if (!this.user.username) {
        this.answer = "Please fill out a username.";
      } else {
          const data = {
            event_id: this.url,
            username: this.username
          };
        this.axios
          //.post("https://chingutime.herokuapp.com/api/events/add", data, {
            .post("http://localhost:5000/api/events/add", data, {
              headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
          })
          .then(response => this.handleResponse(response))
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    
    removeUser() {
      console.log(this.userDelete);
      if (this.userDelete == "Please select a user to remove" || !this.userDelete) {
        this.answer = "Please select a user to remove.";
      } else {
          console.log(this.url);
          const data = {
            event_id: this.url,
            username: this.userDelete
          };
        this.axios
          //.post("https://chingutime.herokuapp.com/api/events/remove", data, {
            .post("http://localhost:5000/api/events/remove", data, {
              headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
          })
          .then(response => this.handleResponse(response))
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    handleResponse(response) {
      if (response.data.success == true) {
        this.answer = response.data.msg.replace(this.url, this.eventPart.title);
        location.reload();
      } else {
        this.answer = response.data.msg;
      }
    },
    deleteEvent() {
      let confirmation = confirm("Are you sure you want to delete this event?");
      if (confirmation == true) {
        const data = {
        event_id: this.url,
        };
        this.axios
            //.post("https://chingutime.herokuapp.com/api/events/delete", data, {
              .post("http://localhost:5000/api/events/delete", data, {
                headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
            })
            .then(response => this.$router.push({ name: 'Home', params: { user: this.user } }))
            .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    schedule() {
      let confirmation = confirm("Are you sure you want to schedule this event?");
      if (confirmation == true) {
        const data = {
        event_id: this.url,
        scheduled: true,

        };
        this.axios
            //.post("https://chingutime.herokuapp.com/api/events/update", data, {
              .post("http://localhost:5000/api/events/update", data, {
                headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
            })
            .then(response => this.handleResponse(response))
            .catch(error => (console.log(error), (this.answer = error)));
      }
    }
  }
};
</script>

<style lang="scss">
.leftMargin {
  margin-left: 15px;
}
.topNegativeMargin {
  margin-top: -15px;
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