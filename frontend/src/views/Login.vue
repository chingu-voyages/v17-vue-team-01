<template>
    <v-container>
        <v-row>
            <v-col v-if="!loginSuccess">
                <v-card class="mx-auto" max-width="400">
                    <v-card-text>
                        <h1>Welcome!</h1>
                        <v-form ref="form" lazy-validation>
                            <v-text-field
                                v-model="username"
                                label="Username"
                                required
                            ></v-text-field>

                            <v-text-field
                                v-model="password"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required]"
                                :type="show1 ? 'text' : 'password'"
                                label="Password"
                                counter
                                @click:append="show1 = !show1"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="processForm" color="success"
                            >Login</v-btn
                        >
                        <v-btn to="/register" class="leftMargin" color="primary"
                            >Register Here</v-btn
                        >
                    </v-card-actions>
                </v-card>
                <br />
                <v-card class="mx-auto" max-width="400" v-if="answer">
                    <v-card-text>
                        <h3>{{ answer }}</h3>
                    </v-card-text>
                </v-card>
            </v-col>
            <Events v-if="loginSuccess" :user="user" />
        </v-row>
        <Calendar v-if="loginSuccess" :user="user" />
    </v-container>
</template>

<script>
import Events from "../components/Events";
import Calendar from "../components/Calendar";

export default {
    components: {
        Events, Calendar
    },
    props: {
        user: Object
    },
    data() {
        return {
            show1: false,
            password: null,
            username: null,
            rules: {
                required: value => !!value || "Password is required"
            },
            answer: null,
            token: null,
            loginSuccess: null
        };
    },
    mounted() {
        if (this.user) {
            this.loginSuccess = true;
        } else {
            this.loginSuccess = false;
            this.answer = null;
        }
        if (localStorage.getItem("user")) {
            this.user = JSON.parse(localStorage.getItem("user"));
            this.loginSuccess = true;
        }
    },
    watch: {
        user: function(newer, older) {
            if (newer) {
                this.loginSuccess = true;
            } else {
                this.loginSuccess = false;
                this.answer = null;
            }
        }
    },
    methods: {
        processForm() {
            if (!this.username || !this.password) {
                this.answer = "Please fill out all the fields.";
            } else {
                this.axios
                    .post("http://34.82.150.138:5000/api/users/login", {
                        username: this.username,
                        password: this.password
                    })
                    .then(
                        response => (
                            (this.answer = response.data.msg),
                            (this.token = response.data.token.slice(7)),
                            (this.loginSuccess = true),
                            this.$emit("loginevent", this.token)
                        )
                    )
                    .catch(
                        error => (console.log(error), (this.answer = error))
                    );
            }
        }
    }
};
</script>

<style lang="css">
.leftMargin {
    margin-left: 15px;
}
</style>
