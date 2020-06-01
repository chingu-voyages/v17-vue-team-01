<template>
 <v-container>
    <v-row>
    <v-col cols="12" md="4">
      <ActionsEvent :url="url" :eventPart="eventPart" :advisableTimeslots="advisableTimeslots"/>
      <v-container>
        <v-card v-if="eventPart && user.username == eventPart.users[0].username && eventPart.scheduled == false" class="mx-auto">
          <h2 class="leftMargin">Edit Event</h2>
          <p class="leftMargin">
            You are the event creator
          </p>
            <v-divider></v-divider>
            <h4 class="leftMargin">Title:</h4>
            <v-card-text>
              <input
                class="input"
                v-on:keyup.enter="editEvent"
                type="text"
                name="title"
                v-model="title"
                placeholder="Title"
              >
            </v-card-text>
            <v-divider></v-divider>
            <h4 class="leftMargin">Details:</h4>
            <v-card-text>
              <input
                class="input"
                v-on:keyup.enter="editEvent"
                type="text"
                name="details"
                v-model="details"
                placeholder="Details"
              >
            </v-card-text>
            <!--<v-col cols="12" justify="center" align="center">
              <v-date-picker no-title v-model="dates" :min="nowDate" range></v-date-picker>
              <br>
              <br>
              <input
                class="input"
                type="text"
                name="Date range"
                v-model="dateRangeText"
                label="Date range"
                disabled
              >
            </v-col> -->
            <v-col cols="12" justify="center" align="center">
              <v-color-picker
                hide-inputs
                hide-canvas
                v-model="color"
                show-swatches
                swatches-max-height="226"
              ></v-color-picker>
            </v-col>

          <v-card-actions class="justify-center">
            <v-btn @click="editEvent" class="center" color="success">Edit Event</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3>{{ answer }}</h3>
          </v-card-text>
        </v-card>
      </v-container>
    </v-col>
    <v-col cols="12" md="8">
      <DisplayEvent
        :eventPart="eventPart"
        :timeslotPart="timeslotPart"
        :advisableTimeslots="advisableTimeslots"
        :userPart="userPart"
        :url="url"
      />
    </v-col>
  </v-row>
 </v-container>
</template>

<script>
import moment from "moment";
import ActionsEvent from "../components/ActionsEvent";
import DisplayEvent from "../components/DisplayEvent";

export default {
  name: "Event",
  components: {
    ActionsEvent,
    DisplayEvent,
  },
  created() {
    this.url = this.$route.params.id;
    //console.log(this.url);
  },
  watch: {
    event: function(newer, older) {
      //console.log(newer);
      if (newer) {
        this.eventPart = this.handleScheduled(this.event[0]);
        this.timeslotPart = this.event[1];
        this.advisableTimeslots = this.handleAdvisable(this.event[2]);
        this.title = this.event[0].title;
        this.details = this.event[0].details;
        this.color = this.event[0].color;
        this.dates = this.event[0].possibleDays;
      }
    }
  },
  data: () => ({
    url: "",
    event: null,
    answer: null,
    eventPart: null,
    timeslotPart: null,
    advisableTimeslots: null,
    username: null,
    color: null,
    details: "",
    title: "",
    dates: [null, null],
    nowDate: moment().format('YYYY-MM-DD'),
  }),
  computed: {
    dateRangeText() {
      if (this.dates) {
        return this.dates.join(" ~ ");
      }
    },
  },
  mounted() {
    //console.log(this.url);
    //console.log(localStorage.getItem("usertoken").replace(/"/g, ""));
    if (this.user) {
      let route;
      process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/show/" + this.url : route = `https://chingutime.herokuapp.com/api/events/show/${this.url}`;      
      this.axios
        .get(route, {
        //.get(process.env.VUE_APP_BE_URL + "events/show/" + this.url, {
          headers: {
            "x-access-token": localStorage
              .getItem("usertoken")
              .replace(/"/g, "")
          }
        })
        .then(response => (this.event = response.data)) //(this.event = response.data))
        .catch(error => (console.log(error), (this.answer = error)));
    }
  },
  methods: {

    editEvent() {
      let confirmation = confirm(
        "Are you sure you want to edit this event?"
      );
      //edit possibleDays , not finished!!!
      if (confirmation == true) {
       /* let dateSplit1 = this.dates[0].split("-");
        let dateSplit2 = this.dates[1].split("-");
        let d1 = new Date(
          Number(dateSplit1[0]),
          Number(dateSplit1[1]) - 1,
          Number(dateSplit1[2])
        );
        let d2 = new Date(
          Number(dateSplit2[0]),
          Number(dateSplit2[1]) - 1,
          Number(dateSplit2[2])
        );

        if (d1.getTime() > d2.getTime()) {
          this.answer =
            "Please select the range with the earlier date first.<br> Ex: 21-04-2020 - 22-04-2020";
        } else if (this.dateNames(d1, d2).length > 10) {
          this.answer = "Currently only a range of 10 dates are selectable";
        } else {*/
          const data = {
            event_id: this.url,
            username: this.username,
            title: this.title,
            details: this.details,
            color: this.color,
            //possibleDays: this.dates
          };
          let route;
          process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "events/update" : route = "https://chingutime.herokuapp.com/api/events/update";          
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
      //}  
    },

    /*dateNames(d1, d2) {
      let oneDay = 24 * 3600 * 1000;
      let array = [];
      for (let i = d1.getTime(); i <= d2.getTime(); i += oneDay) {
        let date = new Date(i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        array.push([year, month, day]);
      }
      return array;
    },*/

    handleResponse(response) {
      if (response.data.success == true) {
        this.answer = response.data.msg.replace(this.url, this.eventPart.title);
        location.reload();
      } else {
        this.answer = response.data.msg;
      }
    },

    handleAdvisable(advisableTimeslots){
      //console.log(typeof(advisableTimeslots));
      if(typeof(advisableTimeslots) == 'object'){
        advisableTimeslots.forEach((tmsl, index) => {
          //console.log(tmsl);
        
          let date = tmsl.substring(0, tmsl.indexOf("T"));
          let time = parseInt(tmsl.substring(tmsl.indexOf("T") + 1, tmsl.indexOf("C"))) + parseInt(this.user.TZ);
          //console.log(time);
          if(time < 0){
            let dateDay = new Date(date);
            let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
            date = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
            time = time + 24;
          }
          if(time > 23){
            let dateDay = new Date(date);
            let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
            date = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
            time = time - 24;
          }
          time < 10 ? time = "0" + time + ":00" : time = time + ":00";
          advisableTimeslots[index] = date + " " + time;
        })
      }
      return advisableTimeslots;
    },
    handleScheduled(eventPart){
      for (let index = 0; index < eventPart.possibleDays.length; index++) {
        if (eventPart.possibleDays[index].length<10) {
          eventPart.possibleDays[index] = eventPart.possibleDays[index].slice(0,-1) + "0" + eventPart.possibleDays[index].slice(8)
        }       
      }
      
      //console.log(eventPart.possibleDays);
      if(eventPart.scheduled == true){
        
          //console.log(eventPart.end);
        
          let dateStart = eventPart.start.substring(0, eventPart.start.indexOf("T"));
          let timeStart = parseInt(eventPart.start.substring(eventPart.start.indexOf("T") + 1, eventPart.start.indexOf(":"))) + parseInt(this.user.TZ);
          //console.log(dateStart);
          if(timeStart < 0){
            let dateDay = new Date(dateStart);
            let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
            dateStart = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
            timeStart = timeStart + 24;
          }
          if(timeStart > 23){
            let dateDay = new Date(dateStart);
            let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
            dateStart = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
            timeStart = timeStart - 24;
          }
          timeStart < 10 ? timeStart = "0" + timeStart + ":00" : timeStart = timeStart + ":00";
          eventPart.start = dateStart + " " + timeStart;
        
          let dateEnd = eventPart.end.substring(0, eventPart.end.indexOf("T"));
          let timeEnd = parseInt(eventPart.end.substring(eventPart.end.indexOf("T") + 1, eventPart.end.indexOf(":"))) + parseInt(this.user.TZ);
          //console.log(dateEnd);
          if(timeEnd < 0){
            let dateDay = new Date(dateEnd);
            let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
            dateEnd = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
            timeEnd = timeEnd + 24;
          }
          if(timeEnd > 23){
            let dateDay = new Date(dateEnd);
            let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
            dateEnd= newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
            timeEnd = timeEnd - 24;
          }
          timeEnd < 10 ? timeEnd = "0" + timeEnd + ":00" : timeEnd = timeEnd + ":00";
          eventPart.end = dateEnd + " " + timeEnd;

      }
      return eventPart;
    }
  }
};
</script>
