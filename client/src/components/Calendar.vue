<template>
  <v-row class="calendar">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="value = today">Today</v-btn>
          <v-btn fab text small color="grey darken-2" @click="$refs.calendar.prev()">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="$refs.calendar.next()">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title class="calendarTitle">
            {{
            title(this.value)
            }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-toolbar-title class="hidden-sm-and-up">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar-title>

              <v-toolbar-title class="hidden-xs-only">
                <v-btn outlined color="grey darken-2" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </v-toolbar-title>
            </template>

            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="70vh" class="calendarRows">
        <v-calendar
          ref="calendar"
          v-model="value"
          :now="today"
          :events="events"
          color="primary"
          :type="type"
          :weekdays="weekdays"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          :event-color="getEventColor"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <h3>{{selectedEvent.details}}</h3>
              <br>
              <h4>Start: {{selectedEvent.start}}</h4>
              <h4>End: {{selectedEvent.end}}</h4>
              <br>
              <h4>Users:</h4>
              <template v-for="user in selectedEvent.users">
                <h4 :key="user">{{ user }}</h4>
              </template>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" :to="eventLink(selectedEvent.id)">View</v-btn>
              <v-btn color="danger" @click="selectedOpen = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Calendar",
  data: () => ({
    today: "2020-01-01",
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    type: "month",
    value: "",
    events: [],
    eventIDs: [],
    serverResponse: [],
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ]
  }),
  mounted() {
    this.today = this.getTodayDate();
    this.value = this.today;
    if (this.usertoken) {
      this.axios
        .get("https://chingutime.herokuapp.com/api/users/profile", {
        //.get(process.env.VUE_APP_BE_URL + "users/profile", {
          headers: { "x-access-token": this.usertoken }
        })
        .then(response => {
          if (!_.isEqual(this.user, response.data)) {
            localStorage.setItem("user", JSON.stringify(response.data));
            this.user = response.data;
          }
          this.setup();
        });
    }
  },
  methods: {
    setup() {
      for (let i = 0; i < this.user.events.length; i++) {
        if (this.user.events[i].scheduled == true) {
          this.eventIDs.push(this.user.events[i]["_id"]);
        }
      }
      for (let j = 0; j < this.eventIDs.length; j++) {
        this.axios
          .get(`https://chingutime.herokuapp.com/api/events/show/${this.eventIDs[j]}`,{
          //.get(process.env.VUE_APP_BE_URL + "events/show/" + this.eventIDs[j],{
              headers: {
                "x-access-token": localStorage
                  .getItem("usertoken")
                  .replace(/"/g, "")
              }
            }
          )
          .then(
            response => (
              this.serverResponse.push(response.data), this.convertToEvent()
            )
          )
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    title(value) {
      let dateArray = value.split("-");
      var date = new Date(
        Date.UTC(dateArray[0], dateArray[1] - 1, dateArray[2])
      );
      const month = date.toLocaleString("en-US", { month: "short" });
      return `${month} ${dateArray[0]}`;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    getEventColor(event) {
      return event.color;
    },
    getTodayDate() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      return yyyy + "-" + mm + "-" + dd;
    },
    convertToEvent() {
      if (this.eventIDs.length == this.serverResponse.length) {
        for (let i = 0; i < this.serverResponse.length; i++) {
          this.events.push({
            id: this.serverResponse[i][0]["_id"],
            color: this.serverResponse[i][0].color,
            end: this.transformTimestamp(this.serverResponse[i][0].end),
            name: this.serverResponse[i][0].title,
            details: this.serverResponse[i][0].details,
            start: this.transformTimestamp(this.serverResponse[i][0].start),
            users: this.transformUsers(this.serverResponse[i][0].users)
          });
        }
      }
    },
    transformTimestamp(input) {
      let time = parseInt(input.slice(11, 14)) + this.user.TZ;
      let day = input.slice(0, 10);
      if(time < 0){
        let dateDay = new Date(day);
        let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
        day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
        time = time + 24;
      }
      if(time > 23){
        let dateDay = new Date(day);
        let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
        day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
        time = time - 24;
      }
      //console.log(day + " " + time + ":00");
      return day + " " + time + ":00";
    },
    transformUsers(input) {
      let result = [];
      for (let i = 0; i < input.length; i++) {
        result.push(input[i].username);
      }
      return result;
    },
    eventLink(id) {
      return "/event/" + id;
    }
  }
};
</script>

<style lang="scss" scoped>
.calendarRows {
  margin-top: 8px;
}
.calendarTitle {
  font-size: 18px;
}
</style>
