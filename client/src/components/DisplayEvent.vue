<template>
  <v-card class="pa-2" outlined tile>
    <v-sheet v-if="eventPart">
      <p>Event: {{ eventPart }}</p>
      <p>Route: /event/{{ url }}</p>
      <p>Event title: {{ eventPart.title }}</p>
      <p>Users:</p>
      <v-list :shaped="shaped">
        <v-list-item-group v-model="event" color="primary">
          <v-list-item :inactive="inactive" v-for="(participants, i) in eventPart.users" :key="i">
            <v-list-item-content class="text-left">
              <v-list-item-title>
                {{ participants.username }} <span v-if: i=0> (Event Creator) </span>
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list :shaped="shaped">
      <p>Timeslots:</p>
      <v-list-item-group v-model="event" color="primary">
          <v-list-item :inactive="inactive" v-for="(timeslot, i) in changeToUserTZ" :key="i">
            <v-list-item-content class="text-left">
              <v-list-item-title>
                Day {{ timeslot.day }} Time {{ timeslot.time  }}
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>


      <p>Advisable Timeslots: {{ advisableTimeslots }} </p>
      
  </v-card>
</template>

<script>
export default {
  name: "DisplayEvent",
  props: {
    eventPart: Object,
    timeslotPart: Array,
    advisableTimeslots: Array,
    url: String
  },
  components: {},
  data: () => ({}),
  watch: {},
  mounted() {
    //this.changeToUserTZ()
  },
  methods: {
    
  },
  computed: {
    changeToUserTZ() {
      console.log(this.user.TZ);
      console.log(this.timeslotPart);
      this.timeslotPart.forEach(timeslot => timeslot.time = parseInt(timeslot.time) + parseInt(this.user.TZ));
      return this.timeslotPart;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>