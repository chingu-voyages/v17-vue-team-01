<template>
  <v-app>
    <v-sheet>
    <v-app-bar
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
          <v-tab to="/">Home</v-tab>
          <v-tab to="/calendar">Calendar</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    </v-sheet>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {
  },

  data: () => ({
  })
};
</script>

<style lang="scss">
</style>
