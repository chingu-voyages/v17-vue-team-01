<template>
    <v-sheet>
        <p>Route {{ url }} <v-btn to="/" color="primary">Home</v-btn></p>
        <p>Event</p>
        <p>{{ userPart }}</p>
        <p>Timeslots</p>
        <p>{{ timeslotPart }}</p>
    </v-sheet>
</template>

<script>
export default {
    name: "Event",
    created() {
        this.url = this.$route.params.id;
    },
    watch: {
        event: function(newer, older) {
            if (newer) {
                this.userPart = this.event[0];
                this.timeslotPart = this.event[1]
            }
        }
    },
    data: () => ({
        url: "",
        event: null,
        answer: null,
        userPart: null,
        timeslotPart: null
    }),
    mounted() {
            this.axios
                .get(`http://34.82.150.138:5000/api/events/show/${this.url}`, {
                    headers: { "x-access-token": localStorage.getItem("token") }
                })
                .then(
                    response => (this.event = response.data),
                )
                .catch(error => (console.log(error), (this.answer = error)))
    }
};
</script>
