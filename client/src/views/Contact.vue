<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <v-card class="mx-auto" max-width="360">
          <v-card-text class="text-left">
            <h1 class="addedLineheight">We would love to hear from you!</h1>
            <br>
            <h3>For any inquiries or issues:</h3>
            <!-- <h3>
              <v-icon>mdi-email</v-icon> chingutime(at)gmail.com
            </h3> -->
  <form method="POST" action="https://formspree.io/chingutime@gmail.com">
    <input
      v-model="name"
      :error-messages="nameErrors"
      :counter="10"
      label="Name"
      type="text"
      name="name"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    >
    <input
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      type="email"
      name="_replyto"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    >
        <input
      v-model="content"
      :error-messages="contentErrors"
      label="Content"
      type="text"
      name="message"
      required
      @input="$v.content.$touch()"
      @blur="$v.content.$touch()"
    >
    <v-btn class="mr-4" type="submit" @click="submit">Send</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </form>
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
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name: "Contact",
  components: {},
  mixins: [validationMixin],
  validations: {
      name: { required, maxLength: maxLength(10) },
      email: { required, email },
      content: { required }
    },
    data: () => ({
      name: '',
      email: '',
      content: ''
    }),
  mounted() {},
  watch: {},
      computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
      contentErrors () {
        const errors = []
        if (!this.$v.content.$dirty) return errors
        !this.$v.content.required && errors.push('Content is required.')
        return errors
      }
    },

    methods: {
      submit () {
        this.$v.$touch()
        this.$router.push({ name: "Home" });
       
      },
      clear () {
        this.$v.$reset()
        this.name = ''
        this.email = ''
        this.select = null
        this.checkbox = false
      },
    },
};
</script>

<style lang="scss">
.addedLineheight {
  line-height: 130%;
}
</style>
