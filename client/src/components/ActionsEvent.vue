<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="360">
            <h1 class="leftMargin">Event Actions</h1>
            <p class="leftMargin" v-if="user.username == eventPart.users[0].username"> You are the event creator </p>
          
            <v-input class="leftMargin">
            <input
              class="input"
              v-on:keyup.enter="getToken"
              type="text"
              name="username"
              v-model="username"
              placeholder="Username"
            >
            <v-btn @click="addUser" class="leftMargin mb-4 mr-4" color="success">Add user</v-btn>
            </v-input>
            <v-input class="leftMargin" v-if="eventPart && user.username == eventPart.users[0].username">
                <select class="input" placeholder="Users" label="Users">
                <option disabled value="">Please select User</option>
                <option v-for="user in eventPart.users" :value="user.username" :key="user">{{user.username}}</option>
                </select>
                <v-btn @click="removeUser" class="leftMargin mr-4" color="warning">Rem user</v-btn>
            </v-input>
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
    };
  },
  mounted() {},
  watch: {},
  methods: {
    addUser() {
      if (!this.username) {
        this.answer = "Please fill out a username.";
      } else {
          console.log(this.url);
          const data = {
            event_id: this.url,
            username: this.username
          };
        this.axios
          .post("https://chingutime.herokuapp.com/api/events/add", data, {
              headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
          })
          .then(response => this.answer = response.data.msg)
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    removeUser(username) {
      if (!this.username) {
        this.answer = "Please fill out a username.";
      } else {
          console.log(this.url);
          const data = {
            event_id: this.url,
            username: this.username
          };
        this.axios
          .post("https://chingutime.herokuapp.com/api/events/remove", data, {
              headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
          })
          .then(response => this.answer = response.data.msg)
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    deleteEvent() {
        const data = {
        event_id: this.url,
        };
        this.axios
            .post("https://chingutime.herokuapp.com/api/events/delete", data, {
                headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
            })
            .then(response => this.answer = response.data.msg)
            .catch(error => (console.log(error), (this.answer = error)));
    },
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