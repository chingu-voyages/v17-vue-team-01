<template>
  <v-container class="text-center" fluid>
    <v-row class="mb-6">
      <v-col>
        <v-card class="mx-auto" min-width="250" tile>
          <v-toolbar color="orange lighten-2">
            <v-toolbar-title>Pending Events</v-toolbar-title>
          </v-toolbar>
          <v-list :shaped="shaped" max-height="35vh" class="overflow-y-auto">
            <v-list-item-group v-model="event" color="primary">
              <template v-for="(event, i) in events">
                <v-list-item :inactive="inactive" :key="i" v-if="event.scheduled == false">
                  <v-list-item-content class="text-left">
                    <v-list-item-title>
                      <v-btn color="orange lighten-2" :to="eventLink(event._id)">View</v-btn>
                      {{ event.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <v-card v-if="check" tile>
          <v-toolbar color="deep-orange lighten-2">
            <v-toolbar-title>No Events</v-toolbar-title>
          </v-toolbar>
          <br>
          <v-btn large color="blue darken-2" dark to="/create-event">Create new Event</v-btn>
          <h3>Please create an event.</h3>
          <br>
        </v-card>
        <v-btn v-else large color="blue darken-2" dark to="/create-event">Create new Event</v-btn>
        <br>
        <br>
        <v-btn v-if="canExport" large color="blue darken-2" dark @click="exportEvents">Export Events</v-btn>
        <br>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3>{{ answer }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="mx-auto" min-width="250" tile>
          <v-toolbar color="deep-purple lighten-2">
            <v-toolbar-title>Scheduled Events</v-toolbar-title>
          </v-toolbar>
          <v-list :shaped="shaped" max-height="35vh" class="overflow-y-auto">
            <v-list-item-group v-model="event" color="primary">
              <template v-for="(event, i) in events">
                <v-list-item :inactive="inactive" :key="i" v-if="event.scheduled == true">
                  <v-list-item-content class="text-left">
                    <v-list-item-title>
                      <v-btn color="deep-purple lighten-2" :to="eventLink(event._id)">View</v-btn>
                      {{ event.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Events",
  data: () => ({
    event: null,
    events: null,
    shaped: true,
    inactive: true,
    check: false,
    answer: null,
    canExport: false
  }),
  mounted() {
    if (this.user) {
      this.events = this.user.events;
    }
    this.checkScheduled();
    if (this.usertoken) {
      let route;
      process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "users/profile" : route = "https://chingutime.herokuapp.com/api/users/profile";  
      this.axios
        .get(route, {
        //.get(process.env.VUE_APP_BE_URL + "users/profile", {
          headers: { "x-access-token": this.usertoken }
        })
        .then(response => {
          if (!_.isEqual(this.user, response.data)) {
            localStorage.setItem("user", JSON.stringify(response.data));
            this.user = response.data;
            this.events = this.user.events;
            this.checkScheduled();
          }
        });
    }
  },
  beforeUpdate() {
    if (this.user) {
      this.events = this.user.events;
    } else {
      this.events = null;
    }
  },
  methods: {
    eventLink(id) {
      return "/event/" + id;
    },
    checkScheduled() {
      let exportCalendar = false;
      this.canExport = false;
      if (_.isEmpty(this.events)) {
        this.check = true;
        this.canExport = false;
      } else {
        this.check = false;
        this.events.forEach(function(event) {
           if(event.scheduled == true){
             return exportCalendar = true;
           }  
        });
        this.canExport = exportCalendar;
        //console.log(this.canExport)
      }
    },
    exportEvents() {
      let confirmation = confirm(
          "You will download ics file with scheduled events, do you want to continue?"
        );
        if (confirmation == true) {
          let route;
          process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/export" : route = `https://chingutime.herokuapp.com/api/users/export`;  
          this.axios
            .get(route,
            //.get(process.env.VUE_APP_BE_URL + "events/export",
              {
                headers: {
                  "x-access-token": localStorage
                    .getItem("usertoken")
                    .replace(/"/g, "")
                },
                responseType: "blob"
              }
            )
            .then(response => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                "Chingu_Time_" +
                  this.user.username +
                  "_exportedEvents.ics"
              );
              document.body.appendChild(link);
              link.click();
              this.answer = "Here you have your exported events.";
            })
            .catch(error => (console.log(error), (this.answer = error)));
        }  
    },
  }
};
</script>

<style lang="scss">
</style>
