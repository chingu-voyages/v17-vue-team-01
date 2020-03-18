<template>
  <v-sheet class="home">
    <Login/>
  </v-sheet>
</template>

<script>
// @ is an alias to /src
import Login from "@/views/Login.vue";

export default {
  name: "Home",
  components: {
    Login
  }
};
</script>
