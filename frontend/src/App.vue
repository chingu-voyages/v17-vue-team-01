<template>
  <v-app>
    <div>
    <v-app-bar
      color="blue darken-3"
      class="mainNav"
      dark
      src="https://images.unsplash.com/photo-1482775907821-a56ec43344fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2552&q=80"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(12,93,156,1), rgba(44,113,165,.5)"
        ></v-img>
      </template>
      <v-toolbar-title>Chingu-Time</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs show-arrows center-active>
          <v-tab>Events</v-tab>
          <v-tab>Calendar</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    </div>
    <v-content>
      <HelloWorld />
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld
  },

  data: () => ({
    //
  })
};
</script>

<style lang="scss">

</style>
