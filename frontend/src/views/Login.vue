<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="username"
      :counter="15"
      :rules="[v => !!v || 'Enter username']"
      label="username"
      required
    ></v-text-field>

    <v-text-field v-model="password" :rules="passwordRules" label="password" required></v-text-field>
  </v-form>
</template>
