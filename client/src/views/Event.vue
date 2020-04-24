<template>
  <v-row class="mb-6">
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
        this.eventPart = this.event[0];
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
          //.get(`http://localhost:5000/api/events/show/${this.url}`, {
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
    }
  }
};
</script>
