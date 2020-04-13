<template>
  <v-container>
    <v-row>
      <Login v-if="!user"/>
      <Events v-if="user"/>
    </v-row>
    <v-row>
      <Calendar v-if="user"/>
    </v-row>
  </v-container>
</template>

<script>
import Login from "../components/Login";
import Events from "../components/Events";
import Calendar from "../components/Calendar";

export default {
  name: "Home",
  components: {
    Events,
    Calendar,
    Login
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style lang="css">
.leftMargin {
  margin-left: 15px;
}
</style>
