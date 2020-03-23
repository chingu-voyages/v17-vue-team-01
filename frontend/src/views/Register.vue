<template>
  <div>
    <h1>New User</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="username"
        :counter="15"
        :rules="[v => !!v || 'Enter username (must be less than 15 characters)']"
        label="username"
        required
      ></v-text-field>

      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

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

      <v-btn @click="create">Create Account</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    email: "";
    emailRules: {
      v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid";
    }
    return {
      show1: false,
      password: "Password",
      rules: {
        required: value => !!value || "Password is required",
        min: v => v.length >= 8 || "Password must be at least 8 characters"
      }
    };
  }
};
</script>