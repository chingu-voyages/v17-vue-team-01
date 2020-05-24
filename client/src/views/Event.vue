<template>
 <v-container>
    <v-row>
    <v-col cols="12" md="4">
      <ActionsEvent :url="url" :eventPart="eventPart" :advisableTimeslots="advisableTimeslots"/>
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
import ActionsEvent from "../components/ActionsEvent";
import DisplayEvent from "../components/DisplayEvent";

export default {
  name: "Event",
  components: {
    ActionsEvent,
    DisplayEvent
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
  }),
  mounted() {
    //console.log(this.url);
    //console.log(localStorage.getItem("usertoken").replace(/"/g, ""));
    if (this.user) {
      this.axios
        .get(`https://chingutime.herokuapp.com/api/events/show/${this.url}`, {
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
      
      //console.log(typeof(advisableTimeslots));
      if(eventPart.scheduled == true){
        
          //console.log(eventPart.start);
        
          let dateStart = eventPart.start.substring(0, eventPart.start.indexOf("T"));
          let timeStart = parseInt(eventPart.start.substring(eventPart.start.indexOf("T") + 1, eventPart.start.indexOf(":"))) + parseInt(this.user.TZ);
          //console.log(timeStart);
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
          //console.log(timeEnd);
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
