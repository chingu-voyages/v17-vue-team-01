<template>
  <v-card class="pa-2" outlined tile>
    <v-sheet>
      <p>Event: {{ event }}</p>
      <p>Route: /event/{{ event[0]._id }}</p>
      <p>Event: {{ event[0].title }}</p>
      <p v-if(!event[1])>Timeslots: {{ event[2] }} </p>
      <p>Users:</p>
      <v-list :shaped="shaped" max-height="35vh" class="overflow-y-auto">
        <v-list-item-group v-model="event" color="primary">
          <v-list-item :inactive="inactive" v-for="(user, i) in event[0].users" :key="i">
            <v-list-item-content class="text-left">
              <v-list-item-title>
                {{ user }}
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
    event,
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