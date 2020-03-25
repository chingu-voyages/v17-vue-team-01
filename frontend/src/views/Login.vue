<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="username"
      :counter="15"
      :rules="[v => !!v || 'Enter username (must be less than 15 characters)']"
      label="username"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min]"
      :type="show1 ? 'text' : 'password'"
      name="input=10-1"
      label="password"
      counter
      @click:append="show1 = !show1"
    ></v-text-field>

    <v-btn @click="login">login</v-btn>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      show1: false,
      password: "Password",
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 15 || "Minimum 15 characters"
      }
    };
  }
};
</script>

