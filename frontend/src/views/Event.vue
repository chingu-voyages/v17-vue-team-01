<template>
    <p>Route {{ url }} <v-btn to="/" color="primary">Home</v-btn></p>
</template>

<script>
export default {
    name: "Event",
    created() {
        // this.url = this.$route.params.id;
        this.url = "5e879d27148d8d6cb087dd2f";
    },
    data: () => ({
        url: "",
        event: null,
        answer: null
    }),
    mounted() {
        console.log(
            this.axios
                .get("http://34.82.150.138:5000/api/events/show", {
                    event_id: this.url
                })
                .then(
                    response => (this.event = response.data),
                    console.log(this.event)
                )
                .catch(error => (console.log(error), (this.answer = error)))
        );
    }
};
</script>
