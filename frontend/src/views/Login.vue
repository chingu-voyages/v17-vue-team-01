<template>
    <v-sheet>
        <v-col v-if="!loginSuccess">
            <v-card class="mx-auto" max-width="400">
                <v-card-text>
                    <h1>Welcome!</h1>
                    <v-form ref="form" lazy-validation>
                        <v-text-field
                            v-model="username"
                            label="username"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required]"
                            :type="show1 ? 'text' : 'password'"
                            label="password"
                            counter
                            @click:append="show1 = !show1"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="processForm" color="primary">Login</v-btn>
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
        <Events />
    </v-sheet>
</template>

<script>
import Events from './Events.vue'

export default {
    components: {
        Events
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
            loginSuccess: false
        };
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
                            (this.loginSuccess = true)
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
