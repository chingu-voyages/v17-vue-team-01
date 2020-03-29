<template>
    <v-col>
        <v-card class="mx-auto" max-width="700" v-if="!eventFirstValidate">
            <v-card-text>
                <h1>Create a new Event!</h1>
                <v-form ref="form" v-model="valid" lazy-validation >
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
