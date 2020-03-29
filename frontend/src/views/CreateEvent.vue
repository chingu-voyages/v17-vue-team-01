<template>
    <v-col>
        <v-card class="mx-auto" max-width="700" v-if="!eventFirstValidate">
            <v-card-text>
                <h1>Create a new Event!</h1>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        label="Event name"
                        required
                    ></v-text-field>

                    <v-row justify="space-around"
                        ><v-col>
                            <v-date-picker
                                no-title
                                v-model="dates"
                                range
                            ></v-date-picker>
                            <br />
                            <v-text-field
                                v-model="dateRangeText"
                                label="Date range"
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-color-picker
                            hide-inputs
                            hide-canvas
                            v-model="color"
                            class="ma-2"
                            show-swatches
                            swatches-max-height="230"
                        ></v-color-picker>
                    </v-row>

                    <br />
                    <v-row justify="center"
                        ><v-btn
                            :disabled="!valid"
                            color="success"
                            class="mr-4"
                            @click="processFormFirst"
                        >
                            Save
                        </v-btn>

                        <v-btn color="error" class="mr-4" @click="reset">
                            Reset Form
                        </v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions class="text-center">
                <v-btn to="/" color="primary">Back Home</v-btn>
            </v-card-actions>
        </v-card>
        <br v-if="!eventFirstValidate" />
        <v-card class="mx-auto" max-width="700" v-if="eventFirstValidate">
            <v-card-text>
                <h1>Select the times</h1>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <template>
                        <v-card class="mx-auto" max-width="200">
                            <v-list shaped dense="true">
                                <v-list-item-group v-model="model" multiple>
                                    <template v-for="(item, i) in items">
                                        <v-divider
                                            v-if="!item"
                                            :key="`divider-${i}`"
                                        ></v-divider>

                                        <v-list-item
                                            v-else
                                            :key="`item-${i}`"
                                            :value="item"
                                            active-class="deep-purple--text text--accent-4"
                                        >
                                            <template
                                                v-slot:default="{
                                                    active,
                                                    toggle
                                                }"
                                            >
                                                <v-list-item-content>
                                                    <v-list-item-title
                                                        v-text="item"
                                                    ></v-list-item-title>
                                                </v-list-item-content>

                                                <v-list-item-action>
                                                    <v-checkbox
                                                        :input-value="active"
                                                        :true-value="item"
                                                        color="deep-purple accent-4"
                                                        @click="toggle"
                                                    ></v-checkbox>
                                                </v-list-item-action>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-list-item-group>
                            </v-list>
                        </v-card>
                    </template>
                    <br />
                    <v-row justify="center"
                        ><v-btn
                            :disabled="!valid"
                            color="success"
                            class="mr-4"
                            @click="processFormSecond"
                        >
                            Save
                        </v-btn>

                        <v-btn color="error" class="mr-4" @click="reset">
                            Reset Form
                        </v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions class="text-center">
                <v-btn to="/" color="primary">Back Home</v-btn>
            </v-card-actions>
        </v-card>
        <v-card class="mx-auto" max-width="400" v-if="answer">
            <v-card-text>
                <h3>{{ answer }}</h3>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script>
export default {
    data: () => ({
        valid: true,
        dates: [null, null],
        name: null,
        color: null,
        colorValue: null,
        answer: null,
        eventFirstValidate: false,
        createdEvent: {
            eventName: null,
            eventDates: null,
            eventColor: null
        },
        items: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00",
        "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
        model: ["18:00"],
        nameRules: [v => !!v || "Name is required"]
    }),
    computed: {
        dateRangeText() {
            return this.dates.join(" ~ ");
        }
    },
    mounted() {
        this.color = "#3f51b5";
    },
    methods: {
        reset() {
            this.$refs.form.reset();
        },
        processFormFirst() {
            if (!this.name || !this.color || !this.dates) {
                this.answer = "Please fill out all the fields.";
            } else {
                this.createdEvent = {
                    eventName: this.name,
                    eventDates: this.dates,
                    eventColor: this.color
                };
                console.log(this.createdEvent);
                this.eventFirstValidate = true;
            }
        }
    }
};
</script>
