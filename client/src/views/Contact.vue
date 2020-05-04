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
  <form class="form" method="POST" action="https://formspree.io/chingutime@gmail.com" data-netlify="true">
    <input class="input" required name="name" v-model="name" placeholder="Name" type="text" autocomplete="off">
		<input class="input" required name="email" v-model="email" placeholder="E-mail" type="email" autocomplete="off">
		<textarea class="input" name="message" rows="4" v-model="message" placeholder="Message"></textarea>
      <v-card-actions class="justify-center">
        <v-btn type="submit" color="success">Send</v-btn>
      </v-card-actions>
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
          <v-card-actions class="justify-center">
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
    data: () => ({
      name: '',
      email: '',
      content: ''
    }),
  mounted() {},
  watch: {},
  computed: {},
  methods: {
      // submit () {
      //   this.$router.push({ name: "Home" });    
      // },
      // clear () {
      //   this.name = ''
      //   this.email = ''
      //   this.content = ''
      // },
    },
};
</script>

<style lang="scss">
.addedLineheight {
  line-height: 130%;
}

.form {
	display: flex;
	flex-direction: column;
	font-size: 16px;
}
//input[type="email"],
//input[type="text"],
/*textarea {
	border: solid 1px #e8e8e8;
	font-family: 'Roboto', sans-serif;
	padding: 10px 7px;
	margin-bottom: 15px;
	outline: none;
}*/
textarea,
.input {
  color: black;
  display: block;
  border: 1px solid black;
  width: 96%;

  border-radius: 3px;
  padding: 10px 5px;
  margin: 0 0 10px 0;
  font-size: 18px;
}

textarea {
	resize: none;
}

.button {
	background: green;
	border: solid 1px green;
	color: white;
	cursor: pointer;
	padding: 10px 50px;
	text-align: center;
	text-transform: uppercase;
}

// .button:hover {
// 	background: #ea532a;
// 	border: solid 1px #ea532a;
// }

//input[type="email"],
//input[type="text"],
//textarea,
.button {
	font-size: 15px;
	border-radius: 3px
}
</style>
