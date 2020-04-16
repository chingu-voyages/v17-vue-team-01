<template>
  <v-container class="text-center" fluid>
    <v-row class="mb-6">
      <v-col>
        <v-card class="mx-auto" min-width="250" tile>
          <v-toolbar color="orange lighten-2">
            <v-toolbar-title>Pending Events</v-toolbar-title>
          </v-toolbar>
          <v-list :shaped="shaped" max-height="35vh" class="overflow-y-auto">
            <v-list-item-group v-model="event" v-if="user" color="primary">
              <v-list-item :inactive="inactive" v-for="(event, i) in events" :key="i">
                <v-list-item-content class="text-left">
                  <v-list-item-title>
                    <v-btn color="orange lighten-2" :to="eventLink(event._id)">View</v-btn>
                    {{ event.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-list-item-group v-model="item" v-else color="primary">
              <v-list-item :inactive="inactive" :key="i">
                <v-list-item-content class="text-left">
                  <v-list-item-title>None</v-list-item-title>
                  <v-list-item-subtitle></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <v-sheet class="text-center">
          <v-btn large color="blue darken-2" dark to="/create-event">Create new Event</v-btn>
        </v-sheet>
      </v-col>
      <v-col>
        <v-card class="mx-auto" min-width="250" tile>
          <v-toolbar color="deep-purple lighten-2">
            <v-toolbar-title>Scheduled Events</v-toolbar-title>
          </v-toolbar>
          <v-list :shaped="shaped" max-height="35vh" class="overflow-y-auto">
            <v-list-item-group v-model="event" v-if="user" color="primary">
              <v-list-item :inactive="inactive" v-for="(event, i) in events" :key="i">
                <v-list-item-content class="text-left" v-if="event.scheduled == true">
                  <v-list-item-title>
                    <v-btn color="deep-purple lighten-2" :to="eventLink(event._id)">View</v-btn>
                    {{ event.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-list-item-group v-model="item" v-else color="primary">
              <v-list-item :inactive="inactive" :key="i">
                <v-list-item-content class="text-left">
                  <v-list-item-title>None</v-list-item-title>
                  <v-list-item-subtitle></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Events",
  data: () => ({
    event: null,
    events: null,
    shaped: true,
    inactive: true
  }),
  mounted() {
    if (this.user) {
      this.events = this.user.events;
    }
  },
  beforeUpdate() {
    if (this.user) {
      this.events = this.user.events;
    } else {
      this.events = null;
    }
  },
  methods: {
    eventLink(id) {
      return "/event/" + id;
    }
  }
};
</script>

<style lang="scss">
</style>
