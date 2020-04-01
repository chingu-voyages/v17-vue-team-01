<template>
    <v-sheet>
        <v-card class="mx-auto" max-width="400">
            <v-card-text>
                <h1>Change User Information</h1>
                <br />
                <h3>Each Field can be set individually or left empty</h3>
                <v-form
                    ref="form"
                    lazy-validation
                    @submit.prevent="processForm"
                >
                    <v-text-field
                        v-model="email"
                        :rules="[rules.email, rules.emailtext]"
                        label="E-mail"
                        class="topMargin"
                    ></v-text-field>

                    <v-text-field v-model="name" label="Name"></v-text-field>

                    <v-text-field
                        v-model="username"
                        label="Username"
                    ></v-text-field>

                    <v-text-field
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required]"
                        :type="show1 ? 'text' : 'password'"
                        label="New Password"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>

                    <v-select
                        v-model="time"
                        :items="zones"
                        menu-props="auto"
                        label="Select"
                        hide-details
                        single-line
                    ></v-select>
                    <br />
                    <br />
                    <v-text-field
                        v-model="oldpassword"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required]"
                        :type="show1 ? 'text' : 'password'"
                        label="Old Password"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="processForm" color="primary"
                    >Update Information</v-btn
                >
            </v-card-actions>
        </v-card>
        <br />
        <v-card class="mx-auto" max-width="400" v-if="answer">
            <v-card-text>
                <h3>{{ answer }}</h3>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script>
export default {
    data() {
        return {
            answer: null,
            token: null,
            user: null,
            username: null,
            password: null,
            oldpassword: null,
            show1: false,
            time: null,
            rules: {
                required: value => !!value || "Password is required",
                email: v => !!v || "E-mail is required",
                emailtext: v => /.+@.+\..+/.test(v) || "E-mail must be valid"
            },
            settings: {},
            zones: [
                "Select Timezone",
                "UTC +14:00 Samoa",
                "UTC +13:45	New Zealand",
                "UTC +13:00 New Zealand",
                "UTC +12:00	Fiji",
                "UTC +11:00	Australia",
                "UTC +10:30	Australia",
                "UTC +10:00	Queensland/Australia",
                "UTC +09:30	Northern Territory/Australia",
                "UTC +09:00	Japan, South Korea",
                "UTC +08:45	Western Australia",
                "UTC +08:00	China, Philippines",
                "UTC +07:00	Indonesia",
                "UTC +06:30	Myanmar",
                "UTC +06:00	Bangladesh",
                "UTC +05:45	Nepal",
                "UTC +05:30	India",
                "UTC +05:00	Pakistan",
                "UTC +04:30	Iran and Afghanistan",
                "UTC +04:00	Azerbaijan",
                "UTC +03:00	Moscow/Russia",
                "UTC +02:00	Greece",
                "UTC +01:00	Germany",
                "UTC +00:00	United Kingdom",
                "UTC -01:00	Cabo Verde",
                "UTC -02:00	Brazil",
                "UTC -02:30 Canada",
                "UTC -03:00	Brazil and Argentina",
                "UTC -04:00 USA New York",
                "UTC -05:00 USA Chicago",
                "UTC -06:00 USA Mexico City",
                "UTC -07:00 USA Los Angeles",
                "UTC -08:00 Alaska/USA",
                "UTC -09:00 Alaska/USA",
                "UTC -09:30 Marquesas Islands",
                "UTC -10:00	Hawaii/USA",
                "UTC -11:00	American Samoa",
                "UTC -12:00	US Minor Outlying Islands"
            ]
        };
    },
    mounted() {
        if (localStorage.getItem("user")) {
            this.user = JSON.parse(localStorage.getItem("user"));
            this.token = localStorage.getItem("token");
        }
    },
    methods: {
        processForm() {
            let confirmation = confirm("Confirm changes?");
            if (confirmation == true) {
                if (this.time) {
                    let direction = this.time.slice(4, 5);
                    let identifier = this.time.slice(5, 7);
                    let addition = this.time.slice(8, 10);

                    let zone = Number(identifier + "." + addition);
                    if (direction == "-") {
                        console.log("sucess");
                        zone *= -1;
                    }
                    this.settings.TZ = zone;
                }

                if (this.name) {
                    this.settings.name = this.name;
                }

                if (this.password) {
                    this.settings.password = this.password;
                    this.settings["confirm_password"] = this.password;
                }

                if (this.username) {
                    this.settings.username = this.username;
                }

                if (this.email) {
                    this.settings.email = this.email;
                }

                if (this.oldpassword) {
                    this.settings.oldpassword = this.oldpassword;
                } else {
                    this.answer = "Please type in your old password.";
                }

                // this.axios
                //     .post("http://34.82.150.138:5000/api/users/update", {
                //          headers: { "x-access-token": this.token },
                //          body: this.settings
                //     })
                //     .then(response => (this.answer = response.data.msg))
                //     .catch(error => (console.log(error), this.answer = error));
            }
        }
    }
};
</script>

<style lang="scss"></style>
