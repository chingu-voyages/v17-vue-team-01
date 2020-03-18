<template>
    <v-row class="calendar">
        <v-col>
            <v-sheet height="64">
                <v-toolbar flat color="white">
                    <v-btn
                        outlined
                        class="mr-4"
                        color="grey darken-2"
                        @click="value = today"
                    >
                        Today
                    </v-btn>
                    <v-btn
                        fab
                        text
                        small
                        color="grey darken-2"
                        @click="$refs.calendar.prev()"
                    >
                        <v-icon small>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                        fab
                        text
                        small
                        color="grey darken-2"
                        @click="$refs.calendar.next()"
                    >
                        <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-toolbar-title class="calendarTitle">{{
                        title(this.value)
                    }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-menu bottom right>
                        <template v-slot:activator="{ on }">
                            <v-btn outlined color="grey darken-2" v-on="on">
                                <span>{{ typeToLabel[type] }}</span>
                                <v-icon right>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="type = 'day'">
                                <v-list-item-title>Day</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'week'">
                                <v-list-item-title>Week</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'month'">
                                <v-list-item-title>Month</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = '4day'">
                                <v-list-item-title>4 days</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-toolbar>
            </v-sheet>
            <v-sheet height="70vh" class="calendarRows">
                <v-calendar
                    ref="calendar"
                    v-model="value"
                    :now="today"
                    :events="events"
                    color="primary"
                    :type="type"
                    :weekdays="weekdays"
                    @click:event="showEvent"
                    @click:more="viewDay"
                    @click:date="viewDay"
                    :event-color="getEventColor"
                ></v-calendar>
                <v-menu
                    v-model="selectedOpen"
                    :close-on-content-click="false"
                    :activator="selectedElement"
                    offset-x
                >
                    <v-card color="grey lighten-4" min-width="350px" flat>
                        <v-toolbar :color="selectedEvent.color" dark>
                            <v-btn icon>
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-toolbar-title
                                v-html="selectedEvent.name"
                            ></v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>mdi-heart</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <span v-html="selectedEvent.details"></span>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                text
                                color="secondary"
                                @click="selectedOpen = false"
                            >
                                Cancel
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
import { getTodayDate } from "../plugins/util.js";

export default {
    data: () => ({
        today: "2020-01-01",
        weekdays: [1, 2, 3, 4, 5, 6, 0],
        type: "month",
        value: "",
        events: [],
        typeToLabel: {
            month: "Month",
            week: "Week",
            day: "Day",
            "4day": "4 Days"
        },
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        colors: [
            "blue",
            "indigo",
            "deep-purple",
            "cyan",
            "green",
            "orange",
            "grey darken-1"
        ]
    }),
    mounted() {
        this.createEvents();
        this.today = getTodayDate();
        this.value = this.today;
        this.$refs.calendar.checkChange();
    },
    methods: {
        createEvents() {
            let dates = [];
            for (let i = 0; i < 6; i++) {
                let month = 3;
                let date = 8 + 7 * i;
                if (date > 31) {
                    month = 4;
                    date = date - 31;
                }
                if (date < 10) {
                    date = "0" + date.toString();
                }
                dates.push({
                    name: "Weekly V17 Meeting",
                    start: `2020-` + month + `-` + date + ` 17:00`,
                    end: `2020-` + month + `-` + date + ` 17:00`,
                    color: this.colors[i]
                });
            }
            console.log(dates);

            this.events = dates;
        },
        title(value) {
            let dateArray = value.split("-");
            var date = new Date(
                Date.UTC(dateArray[0], dateArray[1] - 1, dateArray[2])
            );
            const month = date.toLocaleString("en-US", { month: "long" });
            return `${month} ${dateArray[0]}`;
        },
        viewDay({ date }) {
            this.focus = date;
            this.type = "day";
        },
        showEvent({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event;
                this.selectedElement = nativeEvent.target;
                setTimeout(() => (this.selectedOpen = true), 10);
            };

            if (this.selectedOpen) {
                this.selectedOpen = false;
                setTimeout(open, 10);
            } else {
                open();
            }

            nativeEvent.stopPropagation();
        },
        getEventColor(event) {
            return event.color;
        }
    }
};
</script>

<style lang="scss" scoped>
.calendarRows {
    margin-top: 8px;
}
.calendarTitle {
    margin-left: 5px;
}
</style>
