<template>
    <p>Route {{url}}</p>
</template>

<script>

export default {
    name: "Event",
    created () {
        this.url = this.$route.params.id
    },
    data: () => ({
        url: ""
    })
}
</script>
