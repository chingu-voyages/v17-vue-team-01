<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <v-card class="mx-auto" max-width="360">
          <v-card-text class="text-left">
            <h1 class="addedLineheight">We would love to hear from you!</h1>
            <br>
            <h3>For any inquiries or issues:</h3>
            <h3>
              <v-icon>mdi-email</v-icon> chingutime(at)gmail.com
            </h3>
            <br>
            <h3>Our Team:</h3>
            <v-row>
              <v-col>
                <a href="https://github.com/ally0426" target="_blank">
                  <v-card class="pa-2" outlined tile>
                    <img
                      src="https://avatars0.githubusercontent.com/u/20063017"
                      width="70"
                      height="70"
                    >
                    <h4>Ally</h4>
                  </v-card>
                </a>
              </v-col>
              <v-col>
                <a href="https://github.com/Alexever17" target="_blank">
                  <v-card class="pa-2" outlined tile>
                    <img
                      src="https://avatars3.githubusercontent.com/u/20628702"
                      width="70"
                      height="70"
                    >
                    <h4>Alex</h4>
                  </v-card>
                </a>
              </v-col>
              <v-col>
                <a href="https://github.com/MarcosMe" target="_blank">
                  <v-card class="pa-2" outlined tile>
                    <img
                      src="https://avatars1.githubusercontent.com/u/28023775"
                      width="70"
                      height="70"
                    >
                    <h4>Marcos</h4>
                  </v-card>
                </a>
              </v-col>
              
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn to="/" color="primary">Back Home</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Contact",
  components: {},
  data() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss">
.addedLineheight {
  line-height: 130%;
}
</style>
