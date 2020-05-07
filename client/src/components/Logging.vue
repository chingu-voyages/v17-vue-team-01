<template>
  <v-row class="fill-height" align-content="center" justify="center">
    <v-col class="subtitle-1 text-center" cols="12">
      <v-card class="mx-auto" max-width="360">
        <br>
        <p>Connecting</p>
        <v-progress-linear color="green accent-4" indeterminate rounded height="6"></v-progress-linear>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Logging"
};
</script>

