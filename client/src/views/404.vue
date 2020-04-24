<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1>This page does not exist</h1>
        <br>
        <h3>Please have a nice cat picture instead:</h3>
        <img src="https://source.unsplash.com/collection/139386/" class="image">
        <v-sheet>
          Images are from
          <a href="https://unsplash.com/collections/139386/cats" target="_blank">Unsplash.com</a>
        </v-sheet>
        <br>
        <v-btn to="/" color="primary">Back Home</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "404",
  components: {},
  data() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss">
.image {
  max-height: 400px;
  width: auto;
  max-width: 100%;
}
</style>
