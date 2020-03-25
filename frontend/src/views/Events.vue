<template>
    <v-sheet class="text-center">
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
                <v-list-item-group v-model="item" v-if="items" color="primary">
                    <v-list-item
                        :inactive="inactive"
                        v-for="(item, i) in items"
                        :key="i"
                    >
                        <v-list-item-content class="text-left">
                            <v-list-item-title
                                ><v-btn
                                    color="deep-purple lighten-1"
                                    dark
                                    :to="itemLink(item.link)"
                                    >View</v-btn
                                >
                                {{ item.title }}</v-list-item-title
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
    </v-sheet>
</template>

<script>
export default {
    data: () => ({
        items: [
            {
                title: "TEST-1",
                link: 100
            },
            {
                title: "TEST-2",
                link: 200
            },
            {
                title: "TEST-3",
                link: 300
            },
            {
                title: "TEST-4",
                link: 400
            }
        ],
        shaped: true,
        inactive: true
    }),
    methods: {
        itemLink(number) {
            return "/event/" + number;
        }
    }
};
</script>

<style lang="scss">
.createButton {
    margin: 20px 0;
}
</style>
