<template>
    <v-app>
        <v-sheet>
            <v-app-bar
                class="mainNav"
                dark
                src="https://images.unsplash.com/photo-1482775907821-a56ec43344fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2552&q=80"
            >
                <template v-slot:img="{ props }">
                    <v-img
                        v-bind="props"
                        gradient="to top right, rgba(12,93,156,1), rgba(44,113,165,.5)"
                    ></v-img>
                </template>
                <v-toolbar-title
                    ><v-btn text x-large to="/"
                        >Chingu-Time</v-btn
                    ></v-toolbar-title
                >

                <v-spacer></v-spacer>

                <v-btn icon>
                    <v-icon>mdi-cog</v-icon>
                </v-btn>

                <v-btn icon @click="logout">
                    <v-icon>mdi-logout</v-icon>
                </v-btn>

                <template v-slot:extension>
                    <v-tabs show-arrows center-active>
                        <v-tab to="/">Home</v-tab>
                        <v-tab to="/calendar" v-if="user">Calendar</v-tab>
                    </v-tabs>
                </template>
            </v-app-bar>
        </v-sheet>
        <v-content>
            <router-view
                @loginevent="tokenReceived"
                :user="user"
                :token="token"
            ></router-view>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: "App",
    components: {},
    data: () => ({
        user: null,
        token: null
    }),
    watch: {
        user: function(newer, older) {
            if (newer) {
                localStorage.setItem("user", JSON.stringify(newer));
            }
        }
    },
    methods: {
        tokenReceived(value) {
            this.token = value;
            localStorage.setItem("token", value);
            this.axios
                .get("http://34.82.150.138:5000/api/users/profile", {
                    headers: { "x-access-token": value }
                })
                .then(response => (this.user = response.data));
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.clear();
        }
    }
};
</script>

<style lang="scss" scoped>
.v-btn:before {
    background-color: transparent;
}
</style>
