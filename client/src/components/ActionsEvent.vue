<template>
  <v-container>
    <v-card v-if="eventPart && advisableTimeslots" class="mx-auto">
      <h1 class="leftMargin">Event Actions</h1>
      <p
        class="leftMargin"
        v-if="user.username == eventPart.users[0].username"
      >You are the event creator</p>
      <p
        class="leftMargin"
        v-if="eventPart.users.length == 1"
      >Please add more users</p>
      <div v-if="eventPart.scheduled == false">
        <v-divider></v-divider>
        <v-card-text>
          <input
            class="input"
            v-on:keyup.enter="addUser"
            type="text"
            name="username"
            v-model="username"
            placeholder="Username or email"
          >
        </v-card-text>
        <v-card-actions class="justify-center topNegativeMargin">
          <v-btn @click="addUser" class="center" color="success">Add user</v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-text v-if="eventPart.users.length > 1 && canSchedule">
          <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
            <template v-slot:activator="{ on }">
              <input
                class="input"
                v-model="dateSaved"
                placeholder="Select date to schedule"
                v-on="on"
              >
            </template>
            <v-date-picker
              v-model="date"
              :min="eventPart.possibleDays[0]"
              :max="eventPart.possibleDays[eventPart.possibleDays.length-1]"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
              <v-btn text color="primary" :disabled="!date" @click="dateSelector(input)">OK</v-btn>
            </v-date-picker>
          </v-dialog>

          <select v-model="time" class="input" placeholder="Times" label="Time">
            <option disabled value>Please select time to schedule</option>
            <option v-for="zone in zones" v-bind:value="zone" :key="zone">{{zone}}</option>
          </select>
          <select v-model="numberHours" class="input" placeholder="numberHours" label="numberHour">
            <option disabled value>Amount of hours in the event</option>
            <option
              v-for="zone1 in zones1"
              v-bind:value="zone1.number"
              :key="zone1.number"
            >{{zone1.display}}</option>
          </select>
        </v-card-text>
        <v-card-text class="justify-center" v-else>
          <p v-if="!canSchedule" class="leftMargin" style="font-size: 1rem; margin-bottom: 0px;">
            Cannot schedule an event with days in the past.
          </p>
          <p v-else class="leftMargin" style="font-size: 1rem; margin-bottom: 0px;">
            Cannot schedule the event since you are the only user.
          </p>
        </v-card-text>
        <v-card-actions class="justify-center topNegativeMargin" v-if="eventPart.users.length > 1 && canSchedule">
          <v-btn @click="scheduleEvent" class="center" color="primary">Schedule Event</v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-text
          v-if="user.username == eventPart.users[0].username && eventPart.users.length > 1"
        >
          <select v-model="userDelete" class="input" placeholder="Users" label="Users">
            <option disabled value>Please select User</option>
            <option
              v-for="userDel in eventPart.users.slice(1)"
              :value="userDel.username"
              :key="userDel"
            >{{userDel.username}}</option>
          </select>
        </v-card-text>
        <v-card-actions
          class="justify-center topNegativeMargin"
          v-if="user.username == eventPart.users[0].username && eventPart.users.length > 1"
        >
          <v-btn @click="removeUser" class="center" color="warning">Remove user</v-btn>
        </v-card-actions>

        <v-card-actions
          class="justify-center"
          v-if="user.username != eventPart.users[0].username"
        >
          <v-btn @click="removeSelf" class="center" color="warning">Remove me</v-btn>
        </v-card-actions>

      </div>
      <div v-else>
        <p class="leftMargin">{{eventPart.title}} has already been scheduled!</p>
        <p class="leftMargin">Start: {{ eventPart.start }}</p>
        <p class="leftMargin">End: {{ eventPart.end }}</p>
        <p class="leftMargin" v-if="canUnschedule">Scheduled to start in {{ timeToEvent }} </p>
      <v-divider></v-divider>
      <v-card-actions class="justify-center">
        <v-btn @click="downloadIcs" class="center" color="success">Download ics</v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-actions class="justify-center" v-if="canUnschedule">
        <v-btn @click="unscheduleEvent" class="center" color="warning">Unschedule Event</v-btn>
      </v-card-actions>
      <v-card-actions class="justify-center" v-else>
        <p style="margin-bottom: 0px;">Event already passed, cannot unschedule it</p>
      </v-card-actions>
      </div>
      <v-divider></v-divider>
      <v-card-actions class="justify-center" v-if="user.username == eventPart.users[0].username">
        <v-btn @click="deleteEvent" class="center" color="error">Delete Event</v-btn>
      </v-card-actions>
    </v-card>
    <br>
    <v-card class="mx-auto" max-width="360" v-if="answer">
      <v-card-text>
        <h3>{{ answer }}</h3>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  name: "ActionsEvent",
  props: {
    eventPart: Object,
    url: String,
    advisableTimeslots: Array
  },
  data() {
    return {
      username: null,
      answer: null,
      userDelete: "",
      date: null,
      dateSaved: null,
      modal: false,
      modal2: false,
      time: "",
      zones: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
      ],
      zones1: [
        { number: 1, display: "For one hour" },
        { number: 2, display: "For two hours" },
        { number: 3, display: "For three hours" },
        { number: 4, display: "For four hours" },
        { number: 5, display: "For five hours" }
      ],
      menu2: false,
      numberHours: 1,
      canUnschedule: true,
      canSchedule: true,
      timeToEvent: 0,
    };
  },
  computed() {},
  watch: {
    eventPart: function() {
      const now = moment();
      //console.log(this.eventPart)
      if(now.diff(this.eventPart.start) > 0) this.canUnschedule = false;
      let startForAsHours = this.eventPart.start;
      this.timeToEvent = moment.duration(now.diff(startForAsHours)).humanize();
      if(now.diff(this.eventPart.possibleDays[0], 'milliseconds') > 86400000 ) this.canSchedule = false;
    }, 
    advisableTimeslots: function() {
      if (typeof this.advisableTimeslots != "string") {
        this.date = this.advisableTimeslots[0].substring(
          0,
          this.advisableTimeslots[0].indexOf(" ")
        );
        this.time = parseInt(
          this.advisableTimeslots[0].substring(
            this.advisableTimeslots[0].indexOf(" "),
            this.advisableTimeslots[0].indexOf("00") + 1
          )
        );
        if (this.time < 0) {
          this.time += 24;
          let dateDay = new Date(this.date);
          let newDate = new Date(
            dateDay.setTime(dateDay.getTime() - 1 * 86400000)
          );
          this.date =
            newDate.getFullYear() +
            "-" +
            ("0" + (newDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + newDate.getDate()).slice(-2);
        }
        if (this.time > 23) {
          this.time -= 24;
          let dateDay = new Date(this.date);
          let newDate = new Date(
            dateDay.setTime(dateDay.getTime() + 1 * 86400000)
          );
          this.date =
            newDate.getFullYear() +
            "-" +
            ("0" + (newDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + newDate.getDate()).slice(-2);
        }
        if (this.time < 10) {
          this.time = "0" + this.time;
        }
        this.time += ":00";
        this.dateSaved = this.date;
      }
    }
  },

  methods: {
    moment: function () {
      return moment();
    },

    allowedStep: m => m % 60 === 0,
    
    toSnakeCase: str =>
      str &&
      str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map(x => x.toLowerCase())
        .join("_"),

    dateSelector() {
      this.dateSaved = this.date;
      this.modal = false;
    },

    addUser() {
      if (!this.user.username) {
        this.answer = "Please fill out an username or an email.";
      } else {
        //prevent javascript or html injection
        this.username = this.username.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const data = {
          event_id: this.url,
          username: this.username
        };
        let route;
        process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/add" : route = "https://chingutime.herokuapp.com/api/events/add";          
        this.axios
          .post(route, data,
          //.post(process.env.VUE_APP_BE_URL + "events/add", data, 
          {
            headers: {
              "x-access-token": localStorage
                .getItem("usertoken")
                .replace(/"/g, "")
            }
          })
          .then(response => this.handleResponse(response))
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },

    removeUser() {
      if (
        this.userDelete == "Please select a user to remove" ||
        !this.userDelete
      ) {
        this.answer = "Please select a user to remove.";
      } else {
        const data = {
          event_id: this.url,
          username: this.userDelete
        };
        let route;
        process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/remove" : route = "https://chingutime.herokuapp.com/api/events/remove";          
        this.axios
          .post(route, data,
          //.post(process.env.VUE_APP_BE_URL + "events/remove", data, 
          {
            headers: {
              "x-access-token": localStorage
                .getItem("usertoken")
                .replace(/"/g, "")
            }
          })
          .then(response => this.handleResponse(response))
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    removeSelf() {
      let confirmation = confirm("Are you sure you want to remove yourself from this event?");
      console.log(this.user.username);
      if (confirmation == true) {
        const data = {
          event_id: this.url,
          username: this.user.username
        };
        let route;
        process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/remove" : route = "https://chingutime.herokuapp.com/api/events/remove";          
        this.axios
          .post(route, data,
          //.post(process.env.VUE_APP_BE_URL + "events/remove", data, 
          {
            headers: {
              "x-access-token": localStorage
                .getItem("usertoken")
                .replace(/"/g, "")
            }
          })
          .then(response => this.$router.push({ name: "Home", params: { user: this.user } }))
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
          event_id: this.url
        };
        let route;
        process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/delete" : route = "https://chingutime.herokuapp.com/api/events/delete";          
        this.axios
          .post(route, data,
          //.post(process.env.VUE_APP_BE_URL + "events/delete", data, 
          {
            headers: {
              "x-access-token": localStorage
                .getItem("usertoken")
                .replace(/"/g, "")
            }
          })
          .then(
            response => (
              this.$router.push({ name: "Home", params: { user: this.user } })
            )
          )
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },

    scheduleEvent() {
      if (!this.dateSaved || !this.time) {
        this.answer = "Please fill out all the fields to schedule the event.";
      } else {
        let confirmation = confirm(
          "Are you sure you want to schedule this event?"
        );
        if (confirmation == true) {
          let timeStart = parseInt(this.time.substring(0, 2)) - this.user.TZ;
          console.log(timeStart);
          let dateSavedStart = this.dateSaved;
          if (timeStart < 0) {
            timeStart += 24;
            console.log(timeStart);
            let dateDay = new Date(dateSavedStart);
            let newDate = new Date(
              dateDay.setTime(dateDay.getTime() - 1 * 86400000)
            );
            dateSavedStart =
              newDate.getFullYear() +
              "-" +
              ("0" + (newDate.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + newDate.getDate()).slice(-2);
          }
          if (timeStart > 23) {
            timeStart -= 24;
            let dateDay = new Date(dateSavedStart);
            let newDate = new Date(
              dateDay.setTime(dateDay.getTime() + 1 * 86400000)
            );
            dateSavedStart =
              newDate.getFullYear() +
              "-" +
              ("0" + (newDate.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + newDate.getDate()).slice(-2);
          }
          let start = dateSavedStart + " " + timeStart + ":00:00";
          let timeEnd =
            parseInt(this.time.substring(0, 2)) -
            this.user.TZ +
            this.numberHours;
          let dateSavedEnd = this.dateSaved;
          if (timeEnd < 0) {
            timeEnd += 24;
            let dateDay = new Date(dateSavedEnd);
            let newDate = new Date(
              dateDay.setTime(dateDay.getTime() - 1 * 86400000)
            );
            dateSavedEnd =
              newDate.getFullYear() +
              "-" +
              ("0" + (newDate.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + newDate.getDate()).slice(-2);
          }

          if (timeEnd > 23) {
            timeEnd -= 24;
            let dateDay = new Date(dateSavedEnd);
            let newDate = new Date(
              dateDay.setTime(dateDay.getTime() + 1 * 86400000)
            );
            dateSavedEnd =
              newDate.getFullYear() +
              "-" +
              ("0" + (newDate.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + newDate.getDate()).slice(-2);
          }
          let end = dateSavedEnd + " " + timeEnd + ":00:00";
          const data = {
            event_id: this.url,
            scheduled: "true",
            start: start,
            end: end
          };
          let route;
          process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/update" : route = "https://chingutime.herokuapp.com/api/events/update";          
          this.axios
            .post(route, data,
            //.post(process.env.VUE_APP_BE_URL + "events/update", data,
             {
              headers: {
                "x-access-token": localStorage
                  .getItem("usertoken")
                  .replace(/"/g, ""),
                Accept: "application/octet-stream"
              },
              responseType: "blob"
            })
            .then(response => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                "Chingu_Time_" +
                  this.toSnakeCase(this.eventPart.title) +
                  "_" +
                  this.dateSaved +
                  "T" +
                  this.time.substring(0, 2) +
                  ".ics"
              );
              document.body.appendChild(link);
              link.click();
              this.answer =
                "Congrats, " +
                this.eventPart.title +
                " has been scheduled! Here, you have your ics file.";
              this.$router.push({ name: "Home", params: { user: this.user } });
            })
            .catch(error => (console.log(error), (this.answer = "Could not get the ics file :( Please contact support")));
        }
      }
    },

    unscheduleEvent() {
        let confirmation = confirm(
          "Are you sure you want to unschedule this event?"
        );
        if (confirmation == true) {
          const data = {
            event_id: this.url,
            scheduled: "false",
            start: null,
            end: null
          };
          let route;
          process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/update" : route = "https://chingutime.herokuapp.com/api/events/update";          
          this.axios
            .post(route, data,
            //.post(process.env.VUE_APP_BE_URL + "events/update", data, 
            {
              headers: {
                "x-access-token": localStorage
                  .getItem("usertoken")
                  .replace(/"/g, ""),
              },
            })
            .then(response => this.handleResponse(response))
              
            .catch(error => (console.log(error), (this.answer = error)));
        }
    },

    downloadIcs() {
      let route;
      process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/download/" + this.url : route = `https://chingutime.herokuapp.com/api/events/download/${this.url}`;              
      this.axios
        .get(route,
        //.get(process.env.VUE_APP_BE_URL + "events/download/" + this.url,
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
              this.toSnakeCase(this.eventPart.title) +
              "_" +
              this.eventPart.start.substring(0, 13).replace(" ", "T") +
              ".ics"
          );
          document.body.appendChild(link);
          link.click();
          this.answer = "Here, you have your ics file.";
        })
        .catch(error => (console.log(error), (this.answer = error)));
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

