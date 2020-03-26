<template>
    <v-col class="text-center">
        <v-btn
            x-large
            color="deep-purple darken-3"
            dark
            class="createButton"
            to="/create-event"
            >Create new Event</v-btn
        >
        <v-card class="mx-auto" max-width="400" tile>
            <v-toolbar color="deep-purple lighten-1" dark>
                <v-toolbar-title>Pending Events</v-toolbar-title>
            </v-toolbar>
            <v-list :shaped="shaped">
                <v-list-item-group
                    v-model="event"
                    v-if="user"
                    color="primary"
                >
                    <v-list-item
                        :inactive="inactive"
                        v-for="(event, i) in events"
                        :key="i"
                    >
                        <v-list-item-content class="text-left">
                            <v-list-item-title>
                                <!-- <v-btn
                                    color="deep-purple lighten-1"
                                    dark
                                    :to="eventLink(event.id)"
                                    >View</v-btn
                                > -->
                                {{ event }}</v-list-item-title
                            >
                            <v-list-item-subtitle> </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item-group v-model="item" v-else color="primary">
                    <v-list-item :inactive="inactive" :key="i">
                        <v-list-item-content class="text-left">
                            <v-list-item-title> None</v-list-item-title>
                            <v-list-item-subtitle> </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-col>
</template>

<script>
export default {
    data: () => ({
        event: null,
        events: null,
        shaped: true,
        inactive: true
    }),
    props: {
        user: Object
    },
    beforeUpdate() {
        this.events = this.user.events
    },
    methods: {
        eventLink(id) {
            return "/event/" + id;
        }
    }
};
</script>

<style lang="scss">
.createButton {
    margin: 20px 0;
}
</style>
