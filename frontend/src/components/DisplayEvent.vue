<template>
  <v-card class="pa-2" outlined tile>
    <v-sheet>
      <p>Route {{ url }}</p>
      <p>Event</p>
      <p>{{ userPart }}</p>
      <p>Timeslots</p>
      <p>{{ timeslotPart }}</p>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  name: "DisplayEvent",
  props: {
    userPart,
    timeslotPart,
    advisableTimeslots,
    url
  },
  components: {},
  data: () => ({}),
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>