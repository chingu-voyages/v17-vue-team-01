<template>
  <v-app>
    <v-sheet>
      <v-app-bar
        class="mainNav"
        dark
        src="https://images.unsplash.com/photo-1482775907821-a56ec43344fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2552&q=80"
      >
        <template v-slot:img="{ props }">
          <v-img v-bind="props" gradient="to top right, rgba(12,93,156,1), rgba(44,113,165,.5)"></v-img>
        </template>
        <v-toolbar-title>
          <v-btn text x-large to="/">Chingu-Time</v-btn>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon large to="/settings" v-if="user">
          <v-icon>mdi-cog</v-icon>
        </v-btn>

        <v-btn icon large v-if="user" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
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
  components: {},
  data: () => ({}),
  watch: {},
  mounted() {
    if (this.usertoken) {
      this.axios
        .get("https://chingutime.herokuapp.com/api/users/profile", {
          headers: { "x-access-token": this.usertoken }
        })
        .then(response => this.userUpdate(response));
    }
  },
  methods: {
    logout() {
      this.$store.clearAll();
      //this.user = null;
      //location.reload();
      if(this.$route.path != "/"){
        this.$router.push({ name: 'Home', params: { user: this.user } });
        location.reload();
      }
      else{
        location.reload();
      }
      
    },
    userUpdate(response) {      
      if (!_.isEqual(this.user, response.data)) {  
        localStorage.setItem("user", JSON.stringify(response.data));
        location.reload();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn:before {
  background-color: transparent;
}
</style>
