<template>
  <v-row class="mb-6">
    <v-col cols="12" md="4">
      <v-card class="pa-2" outlined tile>
        <Login/>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <DisplayEvent
        :userPart="userPart"
        :timeslotPart="timeslotPart"
        :advisableTimeslots="advisableTimeslots"
        :url="url"
      />
    </v-col>
  </v-row>
</template>

<script>
import Login from "../components/Login";
import DisplayEvent from "../components/DisplayEvent";

export default {
  name: "Event",
  components: {
    Login,
    DisplayEvent
  },
  created() {
    this.url = this.$route.params.id;
  },
  watch: {
    event: function(newer, older) {
      if (newer) {
        this.userPart = this.event[0];
        this.timeslotPart = this.event[1];
        this.advisableTimeslots = this.event[2];
      }
    }
  },
  data: () => ({
    url: "",
    event: null,
    answer: null,
    userPart: null,
    timeslotPart: null,
    advisableTimeslots: null
  }),
  mounted() {
    if (this.user) {
      this.axios
        .get(`https://chingutime.herokuapp.com/api/events/show/${this.url}`, {
          headers: { "x-access-token": localStorage.getItem("token") }
        })
        .then(response => (this.event = response.data))
        .catch(error => (console.log(error), (this.answer = error)));
    }
  }
};
</script>
