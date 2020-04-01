<template>
    <p>Route {{ url }} <v-btn to="/" color="primary">Home</v-btn></p>
    
</template>

<script>
export default {
    name: "Event",
    created() {
        this.url = this.$route.params.id;
    },
    data: () => ({
        url: "",
        event: null,
        answer: null
    }),
    mounted() {
        // throws error

        // this.axios
        //     .get("http://34.82.150.138:5000/api/events/show", {
        //         body: { event_id: this.url }
        //     })
        //     .then(
        //         response => (this.event = response.data),
        //         console.log(this.event)
        //     )
        //     .catch(error => (console.log(error), (this.answer = error)));
        
        // Might work with backend changes

        // this.axios
        //     .get("http://34.82.150.138:5000/api/events/show", {
        //         headers: { event_id: this.url }
        //     })
        //     .then(
        //         response => (this.event = response.data),
        //         console.log(this.event)
        //     )
        //     .catch(error => (console.log(error), (this.answer = error)));
    }
};
</script>
