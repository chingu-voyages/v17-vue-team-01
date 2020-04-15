<template>
  <v-card class="pa-2" outlined tile>
    <v-sheet>
      <p>Event: {{ eventPart }}</p>
      <p>Route: /event/{{ url }}</p>
      <p v-if="eventPart">Event: {{ eventPart.title }}</p>
      <p>Timeslots: {{ advisableTimeslots }} </p>
      <p>Users:</p>
      <v-list v-if="userPart" :shaped="shaped" max-height="35vh" class="overflow-y-auto">
        <v-list-item-group v-model="event" color="primary">
          <v-list-item :inactive="inactive" v-for="(user, i) in userPart" :key="i">
            <v-list-item-content class="text-left">
              <v-list-item-title>
                {{ user[1] }}
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  name: "DisplayEvent",
  props: {
    eventPart: Object,
    timeslotPart: Array,
    advisableTimeslots: Array,
    userPart: Array,
    url: String
  },
  components: {},
  data: () => ({}),
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>