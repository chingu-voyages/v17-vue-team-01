<template>
  <v-container>
    <v-row justify="center">
      <v-col v-if="!user" cols="12" md="4">
        <Login/>
      </v-col>
      <v-col v-if="!user" cols="12" md="4">
        <v-container>
          <v-row>
            <v-col>
              <v-card class="mx-auto" max-width="360">
                <v-card-text>
                  <h2>Schedule meetings across different timezones easier with Chingu Time!</h2>
                  <br>
                  <h3>You can log in and create a new meeting or event and select your available timeslots if you are part of a meeting.</h3>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <Events v-if="user"/>
    </v-row>
    <Calendar v-if="user"/>
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
